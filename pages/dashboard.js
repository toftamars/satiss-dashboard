import { getSession, signOut } from 'next-auth/react'
import { useEffect } from 'react'

export default function Dashboard({ session }) {
  useEffect(() => {
    // Mevcut dashboard'ı yükle
    if (typeof window !== 'undefined') {
      // index.html'deki dashboard'ı buraya entegre et
      console.log('Dashboard yüklendi')
    }
  }, [])

  return (
    <div>
      <header style={{
        background: '#fff',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1>📊 Zuhal Müzik Dashboard</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>
            👤 {session.user.email}
          </span>
          <button
            onClick={() => signOut()}
            style={{
              background: '#ff4757',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Çıkış Yap
          </button>
        </div>
      </header>
      
      <main style={{ padding: '2rem' }}>
        <div style={{
          background: '#f8f9fa',
          padding: '2rem',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h2>🎉 Email Login Başarılı!</h2>
          <p>Hoş geldiniz, {session.user.email}!</p>
          <p>Dashboard buraya entegre edilecek...</p>
        </div>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
