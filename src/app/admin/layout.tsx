// 'use client' spune lui Next.js că acest fișier rulează în browser (nu pe server)
// Componentele care folosesc useState, useEffect sau event handlers TREBUIE să aibă asta
'use client'

// Importăm funcțiile de autentificare din next-auth
// signOut = funcția care deconectează utilizatorul
// useSession = hook care ne dă informații despre sesiunea curentă (dacă e logat sau nu)
import { signOut, useSession } from 'next-auth/react'

// Link este componenta Next.js pentru navigare între pagini (ca un <a> dar mai rapid)
import Link from 'next/link'

// usePathname = ne dă URL-ul curent al paginii (ex: '/admin/dashboard')
// useRouter = ne permite să redirecționăm utilizatorul către altă pagină programatic
import { usePathname, useRouter } from 'next/navigation'

// useState = hook React pentru a stoca și actualiza date în componentă
// useEffect = hook React care rulează cod când componenta se încarcă sau când se schimbă ceva
import { useEffect, useState } from 'react'

// =============================================================================
// Componenta AdminLayout - Layout-ul principal pentru toate paginile admin
// Aceasta "învelește" toate paginile din /admin/ cu un sidebar și header
// "children" reprezintă conținutul paginii care se afișează în interior
// =============================================================================
export default function AdminLayout({
  children,
}: {
  // React.ReactNode înseamnă că children poate fi orice element React (text, componente, etc.)
  children: React.ReactNode
}) {
  // Extragem datele sesiunii (session) și statusul autentificării
  // session = datele utilizatorului logat (null dacă nu e logat)
  // status = 'loading' | 'authenticated' | 'unauthenticated'
  const { data: session, status } = useSession()

  // router ne permite să trimitem utilizatorul la altă pagină (ex: router.push('/admin/login'))
  const router = useRouter()

  // pathname = URL-ul curent, ex: '/admin/dashboard' sau '/admin/images'
  const pathname = usePathname()

  // Stocăm dacă sidebar-ul (meniul lateral) este deschis pe mobil
  // true = sidebar-ul este vizibil, false = sidebar-ul este ascuns
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // useEffect rulează de fiecare dată când session, status, router sau pathname se schimbă
  // Scopul: dacă utilizatorul NU este logat, îl trimitem la pagina de login
  useEffect(() => {
    // Dacă încă se verifică sesiunea, nu facem nimic (așteptăm)
    if (status === 'loading') return
    // Dacă nu există sesiune (nu e logat) și nu suntem deja pe pagina de login
    if (!session && pathname !== '/admin/login') {
      // Redirecționăm utilizatorul la pagina de login
      router.push('/admin/login')
    }
  }, [session, status, router, pathname])

  // ==========================================================================
  // Ecranul de încărcare - se afișează cât timp se verifică dacă utilizatorul e logat
  // ==========================================================================
  if (status === 'loading') {
    return (
      // Container centrat pe ecran cu fundal negru
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        {/* Cercul animat de încărcare (spinner) - se rotește continuu */}
        <div className="w-10 h-10 border-2 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin"></div>
      </div>
    )
  }

  // Dacă suntem pe pagina de login, afișăm DOAR conținutul paginii de login
  // fără sidebar sau header (login-ul are propriul design)
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Dacă nu există sesiune (utilizatorul nu e logat), nu afișăm nimic
  // useEffect de mai sus se va ocupa să-l redirecționeze la login
  if (!session) {
    return null
  }

  // ==========================================================================
  // Meniul de navigare principal - lista de link-uri din sidebar
  // Fiecare element are: name (numele afișat), href (adresa URL), icon (iconița)
  // ==========================================================================
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'fas fa-th-large' },
    { name: 'Hero Slider', href: '/admin/hero-slider', icon: 'fas fa-panorama' },
    { name: 'Video Showreel', href: '/admin/showreel', icon: 'fas fa-video' },
    { name: 'Categorii', href: '/admin/categories', icon: 'fas fa-folder-open' },
    { name: 'Imagini', href: '/admin/images', icon: 'fas fa-images' },
    { name: 'Pachete', href: '/admin/packages', icon: 'fas fa-tag' },
  ]

  // Meniul secundar - link-uri mai puțin importante, afișate separat
  const secondaryNav = [
    { name: 'Evenimente', href: '/admin/events', icon: 'fas fa-calendar-alt' },
  ]

  // Funcție care verifică dacă un link din meniu este activ (pagina curentă)
  // Compară URL-ul curent cu href-ul link-ului
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  // ==========================================================================
  // Randarea (afișarea) layout-ului cu sidebar și conținut principal
  // ==========================================================================
  return (
    // Container principal - ocupă tot ecranul, fundal negru, text alb
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Overlay-ul mobil - fundal semi-transparent care apare când sidebar-ul e deschis pe mobil */}
      {/* Când apeși pe el, sidebar-ul se închide */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar-ul (meniul lateral stâng) */}
      {/* Pe desktop (lg:) este mereu vizibil, pe mobil apare/dispare cu animație */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#111111] border-r border-white/[0.06] z-50 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Secțiunea logo - afișează inițialele "BC" și textul "Admin" */}
          <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06]">
            {/* Logo-ul cu inițialele "BC" în culoare aurie */}
            <span className="text-[#fbbf24] font-semibold text-xl tracking-wider" style={{fontFamily: "'Playfair Display', serif"}}>BC</span>
            {/* Linie verticală decorativă separatoare */}
            <div className="h-4 w-px bg-white/10"></div>
            {/* Textul "Admin" */}
            <span className="text-white/50 text-xs tracking-widest uppercase">Admin</span>
          </div>

          {/* Secțiunea de navigare - conține toate link-urile din meniu */}
          <nav className="flex-1 px-3 py-4">
            {/* Lista de link-uri principale */}
            <div className="space-y-1">
              {/* Iterăm prin fiecare element din navigation și creăm un link */}
              {/* .map() trece prin fiecare element din array și returnează un element JSX */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    // Dacă link-ul este activ, îi dăm un stil evidențiat (auriu)
                    isActive(item.href)
                      ? 'bg-[#fbbf24]/10 text-[#fbbf24] border-l-2 border-[#fbbf24]'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Iconița link-ului (ex: fas fa-images) */}
                  <i className={`${item.icon} w-5 text-center text-xs`}></i>
                  {/* Numele link-ului (ex: "Dashboard", "Imagini") */}
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Secțiunea de navigare secundară - separată vizual cu o linie */}
            <div className="mt-6 pt-4 border-t border-white/[0.04]">
              {/* Eticheta "Avansat" deasupra link-urilor secundare */}
              <p className="px-3 mb-2 text-[10px] text-white/20 uppercase tracking-widest">Avansat</p>
              {/* Iterăm prin link-urile secundare */}
              {secondaryNav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive(item.href)
                      ? 'bg-[#fbbf24]/10 text-[#fbbf24] border-l-2 border-[#fbbf24]'
                      : 'text-white/30 hover:text-white/60 hover:bg-white/[0.04]'
                  }`}
                >
                  <i className={`${item.icon} w-5 text-center text-xs`}></i>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Link rapid către site-ul public - se deschide într-un tab nou */}
            <div className="mt-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/20 hover:text-white/50 hover:bg-white/[0.02] transition-all"
              >
                {/* Iconița de link extern */}
                <i className="fas fa-external-link-alt w-5 text-center text-xs"></i>
                Vezi site-ul
              </a>
            </div>
          </nav>

          {/* Secțiunea utilizator - afișează numele/email-ul și butonul de deconectare */}
          <div className="px-4 py-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3">
              {/* Avatar-ul utilizatorului - un cerc cu iconița de user */}
              <div className="w-8 h-8 rounded-full bg-[#fbbf24]/10 flex items-center justify-center">
                <i className="fas fa-user text-[#fbbf24] text-xs"></i>
              </div>
              <div className="flex-1 min-w-0">
                {/* Afișăm numele sau email-ul utilizatorului logat */}
                <p className="text-sm text-white/70 truncate">{session.user?.name || session.user?.email}</p>
                {/* Butonul de deconectare - la click, deconectează și redirecționează la login */}
                <button
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="text-xs text-white/30 hover:text-red-400 transition-colors"
                >
                  Deconectare
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Conținutul principal - se afișează în dreapta sidebar-ului */}
      <div className="lg:ml-64">
        {/* Header-ul mobil - vizibil doar pe ecrane mici, conține butonul de meniu */}
        <div className="lg:hidden flex items-center h-14 px-4 border-b border-white/[0.06] bg-[#111111]">
          {/* Buton hamburger - deschide sidebar-ul pe mobil */}
          <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white">
            <i className="fas fa-bars text-lg"></i>
          </button>
          {/* Logo "BC" și "Admin" în header-ul mobil */}
          <span className="ml-4 text-[#fbbf24] font-semibold tracking-wider" style={{fontFamily: "'Playfair Display', serif"}}>BC</span>
          <span className="ml-2 text-white/30 text-xs tracking-widest uppercase">Admin</span>
        </div>

        {/* Zona principală unde se afișează conținutul paginii curente */}
        {/* children = componenta paginii (Dashboard, Imagini, Pachete, etc.) */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
