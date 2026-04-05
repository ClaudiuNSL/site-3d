'use client'

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [session, status, router, pathname])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-10 h-10 border-2 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!session) {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: 'fas fa-th-large' },
    { name: 'Hero Slider', href: '/admin/hero-slider', icon: 'fas fa-panorama' },
    { name: 'Video Showreel', href: '/admin/showreel', icon: 'fas fa-video' },
    { name: 'Categorii', href: '/admin/categories', icon: 'fas fa-folder-open' },
    { name: 'Imagini', href: '/admin/images', icon: 'fas fa-images' },
  ]

  const secondaryNav = [
    { name: 'Evenimente', href: '/admin/events', icon: 'fas fa-calendar-alt' },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#111111] border-r border-white/[0.06] z-50 transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06]">
            <span className="text-[#fbbf24] font-semibold text-xl tracking-wider" style={{fontFamily: "'Playfair Display', serif"}}>BC</span>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-white/50 text-xs tracking-widest uppercase">Admin</span>
          </div>

          {/* Main Nav */}
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive(item.href)
                      ? 'bg-[#fbbf24]/10 text-[#fbbf24] border-l-2 border-[#fbbf24]'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                  }`}
                >
                  <i className={`${item.icon} w-5 text-center text-xs`}></i>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Secondary nav */}
            <div className="mt-6 pt-4 border-t border-white/[0.04]">
              <p className="px-3 mb-2 text-[10px] text-white/20 uppercase tracking-widest">Avansat</p>
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

            {/* Quick link to site */}
            <div className="mt-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/20 hover:text-white/50 hover:bg-white/[0.02] transition-all"
              >
                <i className="fas fa-external-link-alt w-5 text-center text-xs"></i>
                Vezi site-ul
              </a>
            </div>
          </nav>

          {/* User */}
          <div className="px-4 py-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fbbf24]/10 flex items-center justify-center">
                <i className="fas fa-user text-[#fbbf24] text-xs"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/70 truncate">{session.user?.name || session.user?.email}</p>
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

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center h-14 px-4 border-b border-white/[0.06] bg-[#111111]">
          <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white">
            <i className="fas fa-bars text-lg"></i>
          </button>
          <span className="ml-4 text-[#fbbf24] font-semibold tracking-wider" style={{fontFamily: "'Playfair Display', serif"}}>BC</span>
          <span className="ml-2 text-white/30 text-xs tracking-widest uppercase">Admin</span>
        </div>

        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
