// 'use client' spune lui Next.js că acest fișier rulează în browser (nu pe server)
'use client'

// useSession = hook care ne dă informații despre sesiunea utilizatorului (logat sau nu)
import { useSession } from 'next-auth/react'
// useRouter = ne permite să redirecționăm utilizatorul către altă pagină
import { useRouter } from 'next/navigation'
// useEffect = hook React care rulează cod automat când componenta se încarcă
import { useEffect } from 'react'

// =============================================================================
// Componenta AdminPage - Pagina principală /admin
// Aceasta NU afișează nimic - doar redirecționează utilizatorul:
//   - Dacă e logat -> merge la /admin/dashboard
//   - Dacă NU e logat -> merge la /admin/login
// =============================================================================
export default function AdminPage() {
  // Extragem sesiunea și statusul autentificării
  // session = datele utilizatorului (null dacă nu e logat)
  // status = 'loading' | 'authenticated' | 'unauthenticated'
  const { data: session, status } = useSession()

  // router = obiectul care ne permite să navigăm programatic la alte pagini
  const router = useRouter()

  // useEffect se execută când session, status sau router se schimbă
  // Scopul: redirecționăm utilizatorul în funcție de starea autentificării
  useEffect(() => {
    // Dacă încă se verifică sesiunea, așteptăm (nu facem nimic)
    if (status === 'loading') return

    if (session) {
      // Utilizatorul este logat -> îl trimitem la dashboard
      router.push('/admin/dashboard')
    } else {
      // Utilizatorul NU este logat -> îl trimitem la pagina de login
      router.push('/admin/login')
    }
  }, [session, status, router])

  // ==========================================================================
  // Ecranul de încărcare - se afișează cât timp se verifică autentificarea
  // ==========================================================================
  if (status === 'loading') {
    return (
      // Container centrat vertical și orizontal, ocupă tot ecranul
      <div className="min-h-screen flex items-center justify-center">
        {/* Cerc animat de încărcare (spinner) - se rotește continuu */}
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // Acest ecran se afișează pentru o fracțiune de secundă înainte de redirecționare
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Același spinner de încărcare */}
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
    </div>
  )
}
