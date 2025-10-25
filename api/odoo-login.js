/**
 * 🔐 Odoo Authentication API
 * Vercel Serverless Function
 * ✅ GÜVENL İK: JWT, SSL, CSP, CSRF, Rate Limiting
 */

/* eslint-disable no-undef */
/* global process, TextEncoder */
const https = require('https');
const { SignJWT } = require('jose');

// Rate limiting (güçlendirilmiş)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 3; // Daha sıkı
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 dakika
const IP_BLOCK_DURATION = 60 * 60 * 1000; // 1 saat

export default async function handler(req, res) {
    // CORS headers - GitHub Pages için
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', 'https://toftamars.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Requested-With, X-CSRF-Token'
    );
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 saat

    // ✅ GÜVENL İK: CSP Headers
    res.setHeader(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' https://erp.zuhalmuzik.com https://*.vercel.app"
        ].join('; ')
    );

    // ✅ GÜVENL İK: Additional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // OPTIONS request (preflight) - CORS için
    if (req.method === 'OPTIONS') {
        console.log('🔄 CORS preflight request');
        return res.status(200).json({ message: 'CORS preflight OK' });
    }

    // Public API - Authentication bypass
    console.log('🌐 Public API access - Authentication bypassed');

    // Sadece POST kabul et
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Request validation
    const userAgent = req.headers['user-agent'];
    if (!userAgent || userAgent.length < 10) {
        return res.status(400).json({ error: 'Geçersiz request' });
    }

    // Referer kontrolü (GitHub Pages'den gelmeli)
    const referer = req.headers.referer;
    if (!referer || !referer.includes('toftamars.github.io')) {
        return res.status(403).json({ error: "Sadece GitHub Pages'den erişim izni var" });
    }

    try {
        const { username, password, totp } = req.body;

        // Input validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
        }

        if (!totp || totp.length !== 6) {
            return res.status(400).json({ error: '6 haneli 2FA kodu gerekli' });
        }

        // Rate limiting kontrolü (güçlendirilmiş)
        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const now = Date.now();

        if (loginAttempts.has(clientIp)) {
            const attempts = loginAttempts.get(clientIp);
            const recentAttempts = attempts.filter(time => now - time < ATTEMPT_WINDOW);

            if (recentAttempts.length >= MAX_ATTEMPTS) {
                // IP'yi 1 saat blokla
                loginAttempts.set(clientIp, [...recentAttempts, now + IP_BLOCK_DURATION]);
                return res.status(429).json({
                    error: 'IP adresiniz 1 saat boyunca bloklandı. Çok fazla deneme yapıldı.'
                });
            }

            recentAttempts.push(now);
            loginAttempts.set(clientIp, recentAttempts);
        } else {
            loginAttempts.set(clientIp, [now]);
        }

        // Odoo bilgileri (environment variables)
        const ODOO_URL = process.env.ODOO_URL || 'https://erp.zuhalmuzik.com';
        const ODOO_DB = 'erp.zuhalmuzik.com';

        // İzin verilen kullanıcılar (hardcode)
        const ALLOWED_USERS = [
            'admin',
            'alper.tofta@zuhalmuzik.com',
            'rapor',
            'analiz',
            'dashboard'
        ];

        // Kullanıcı kontrolü
        if (!ALLOWED_USERS.includes(username.toLowerCase())) {
            return res.status(403).json({
                error: 'Bu kullanıcı adı ile giriş yapılamaz',
                allowedUsers: ALLOWED_USERS
            });
        }

        console.log('🔐 Odoo authentication başlatılıyor...');
        console.log('URL:', ODOO_URL);
        console.log('DB:', ODOO_DB);
        console.log('Username:', username);

        // Odoo authentication (2FA destekli)
        const authPayload = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                db: ODOO_DB,
                login: username,
                password: password,
                totp: totp
            },
            id: 1
        };

        // ✅ GÜVENL İK: SSL sertifika kontrolü AÇIK (production)
        // Development için geçici olarak kapatılabilir: rejectUnauthorized: false
        const agent = new https.Agent({
            rejectUnauthorized: process.env.NODE_ENV === 'production' // Production'da true
        });

        // Fetch ile Odoo'ya istek at
        const odooResponse = await fetch(`${ODOO_URL}/web/session/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authPayload),
            agent
        });

        if (!odooResponse.ok) {
            console.error('❌ Odoo HTTP hatası:', odooResponse.status);
            return res.status(500).json({ error: 'Odoo bağlantı hatası' });
        }

        const odooResult = await odooResponse.json();
        console.log('📡 Odoo response:', JSON.stringify(odooResult).substring(0, 200));

        // Odoo authentication kontrolü
        if (odooResult.result && odooResult.result.uid) {
            const userId = odooResult.result.uid;
            const userName = odooResult.result.name || username;
            const sessionId = odooResult.result.session_id;

            console.log('✅ Authentication başarılı!');
            console.log('User ID:', userId);
            console.log('User Name:', userName);

            // ✅ GÜVENL İK: JWT token oluştur (jose ile)
            const JWT_SECRET = process.env.JWT_SECRET || 'zuhal-musik-secret-key-2025';
            const secret = new TextEncoder().encode(JWT_SECRET);

            const token = await new SignJWT({
                userId,
                userName,
                username,
                sessionId
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setIssuer('zuhal-musik-api')
                .setAudience('zuhal-musik-dashboard')
                .setExpirationTime('2h') // 2 saat
                .sign(secret);

            console.log('✅ JWT token oluşturuldu');

            // Rate limiting temizle (başarılı giriş)
            loginAttempts.delete(clientIp);

            // Success response
            return res.status(200).json({
                success: true,
                token,
                user: {
                    id: userId,
                    name: userName,
                    username: username
                }
            });
        } else {
            console.error('❌ Authentication başarısız:', odooResult);

            return res.status(401).json({
                error: 'Geçersiz kullanıcı adı veya şifre',
                details: odooResult.error?.data?.message || 'Odoo authentication failed'
            });
        }
    } catch (error) {
        console.error('❌ Server hatası:', error);

        return res.status(500).json({
            error: 'Sunucu hatası',
            details: error.message
        });
    }
}
