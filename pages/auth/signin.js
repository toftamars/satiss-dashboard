import { getSession, signIn, getProviders } from 'next-auth/react'
import { useState } from 'react'

export default function SignIn({ providers }) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await signIn('email', { 
        email, 
        redirect: false,
        callbackUrl: '/dashboard'
      })
      alert('Magic link gönderildi! Email kutunuzu kontrol edin.')
    } catch (error) {
      alert('Hata: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#333', marginBottom: '2rem' }}>
          🔐 Zuhal Müzik Dashboard
        </h1>
        
        <form onSubmit={handleEmailSignIn}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              placeholder="Email adresinizi girin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              background: isLoading ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Gönderiliyor...' : 'Magic Link Gönder'}
          </button>
        </form>
        
        <p style={{ 
          marginTop: '1rem', 
          fontSize: '14px', 
          color: '#666' 
        }}>
          Email kutunuzda magic link bulacaksınız
        </p>
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  
  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  const providers = await getProviders()
  
  return {
    props: {
      providers: providers ?? {},
    },
  }
}
