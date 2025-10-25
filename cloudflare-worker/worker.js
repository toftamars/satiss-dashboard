/**
 * Cloudflare Worker - Odoo CORS Proxy
 * GitHub Pages → Cloudflare Worker → Odoo
 */

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://toftamars.github.io',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Get request body
      const body = await request.json();
      const { username, password, totp } = body;

      // Odoo authentication
      const odooUrl = 'https://erp.zuhalmuzik.com';
      const odooDb = 'erp.zuhalmuzik.com';

      const odooPayload = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: odooDb,
          login: username,
          password: password,
          totp_token: totp
        },
        id: 1
      };

      // Call Odoo
      const odooResponse = await fetch(`${odooUrl}/web/session/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(odooPayload)
      });

      const result = await odooResponse.json();

      // Check Odoo response
      if (result.result && result.result.uid) {
        return new Response(JSON.stringify({
          success: true,
          token: result.result.session_id,
          user: {
            id: result.result.uid,
            name: result.result.name || result.result.username || username,
            username: username
          }
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      } else if (result.error) {
        return new Response(JSON.stringify({
          success: false,
          error: result.error.data?.message || result.error.message || 'Login failed'
        }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      } else {
        return new Response(JSON.stringify({
          success: false,
          error: 'Invalid response from Odoo'
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};

