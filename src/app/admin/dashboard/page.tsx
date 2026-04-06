// 'use client' spune lui Next.js că acest fișier rulează în browser
'use client'

// Importăm tipurile de date definite în proiect
// Category = structura unei categorii de fotografii
// Image as ImageType = tipul Image redenumit (pentru a nu se confunda cu componenta Image)
// HeroSlide = structura unui slide din slider-ul de pe homepage
import { Category, Image as ImageType, HeroSlide } from '@/types'
// Image = componenta Next.js pentru afișarea optimizată a imaginilor
import Image from 'next/image'
// Link = componenta Next.js pentru navigare între pagini (mai rapidă decât <a>)
import Link from 'next/link'
// useEffect = rulează cod la încărcarea componentei sau când se schimbă ceva
// useState = stochează date reactive (care se pot schimba și reîmprospătează pagina)
import { useEffect, useState } from 'react'
// Importăm stilurile CSS specifice dashboard-ului
import './dashboard.css'

// =============================================================================
// Tipul DashboardStats - structura statisticilor afișate pe dashboard
// Definește câmpurile pentru contoarele din partea de sus a paginii
// =============================================================================
interface DashboardStats {
  categoriesCount: number    // Numărul total de categorii
  eventsCount: number        // Numărul total de evenimente
  imagesCount: number        // Numărul total de imagini/fotografii
  heroSlidesCount: number    // Numărul total de slide-uri din hero slider
}

// =============================================================================
// AdminDashboard - Pagina principală a panoului de administrare
// Afișează: statistici, acțiuni rapide, previzualizare slider, categorii și imagini recente
// =============================================================================
export default function AdminDashboard() {
  // Indică dacă datele se încarcă de la server (true = se încarcă)
  const [loading, setLoading] = useState(true)

  // Stocăm statisticile (contoarele) - inițial toate sunt 0
  const [stats, setStats] = useState<DashboardStats>({
    categoriesCount: 0,
    eventsCount: 0,
    imagesCount: 0,
    heroSlidesCount: 0,
  })

  // Stocăm lista de imagini recente (ultimele adăugate)
  const [recentImages, setRecentImages] = useState<ImageType[]>([])
  // Stocăm lista de categorii
  const [categories, setCategories] = useState<Category[]>([])
  // Stocăm lista de slide-uri din hero slider
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  // Stocăm ora curentă (pentru salut: "Bună dimineața" / "Bună ziua" / "Bună seara")
  const [currentTime, setCurrentTime] = useState(new Date())

  // ==========================================================================
  // Timer pentru actualizarea orei - se actualizează la fiecare minut (60000ms)
  // setInterval = funcție care rulează cod repetat la un interval de timp
  // clearInterval = oprește timer-ul când componenta se demontează (cleanup)
  // ==========================================================================
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    // Funcția returnată se execută când componenta se demontează (curățare)
    return () => clearInterval(timer)
  }, [])

  // ==========================================================================
  // Preluarea datelor de la server - se execută o singură dată la încărcare
  // ==========================================================================
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Trimitem ambele cereri în paralel (simultan) pentru viteză
        // Promise.all așteaptă ca AMBELE cereri să se termine
        const [dashRes, heroRes] = await Promise.all([
          // Cerere GET pentru statistici și date recente
          fetch('/api/admin/dashboard'),
          // Cerere GET pentru slide-urile din hero slider
          fetch('/api/admin/hero-slides'),
        ])

        // Procesăm răspunsul de la dashboard
        if (dashRes.ok) {
          const data = await dashRes.json()
          // Setăm statisticile primite de la server
          setStats({
            ...data.stats,             // Copiem toate statisticile
            heroSlidesCount: 0,        // Vom actualiza mai jos cu datele reale
          })
          // Setăm imaginile recente (dacă există)
          setRecentImages(data.recentItems?.images || [])
          // Setăm categoriile (dacă există)
          setCategories(data.recentItems?.categories || [])
        }

        // Procesăm răspunsul de la hero slides
        if (heroRes.ok) {
          const heroData = await heroRes.json()
          // Salvăm slide-urile
          setHeroSlides(heroData)
          // Actualizăm contorul de slide-uri în statistici
          // prev = valoarea anterioară a stats (funcție de actualizare)
          setStats(prev => ({ ...prev, heroSlidesCount: heroData.length }))
        }
      } catch (error) {
        // Dacă a apărut o eroare, o afișăm în consola browserului
        console.error('Error fetching dashboard:', error)
      } finally {
        // Oprim starea de încărcare (indiferent de succes sau eroare)
        setLoading(false)
      }
    }
    // Apelăm funcția de preluare a datelor
    fetchAll()
  }, [])

  // ==========================================================================
  // Mesajul de salut - se schimbă în funcție de ora din zi
  // Folosim o funcție IIFE (Immediately Invoked Function Expression)
  // (() => { ... })() = funcție care se execută imediat
  // ==========================================================================
  const greeting = (() => {
    const hour = currentTime.getHours()   // Obținem ora curentă (0-23)
    if (hour < 12) return 'Bună dimineața'  // Între 0:00 și 11:59
    if (hour < 18) return 'Bună ziua'       // Între 12:00 și 17:59
    return 'Bună seara'                      // Între 18:00 și 23:59
  })()

  // ==========================================================================
  // Ecranul de încărcare - afișat cât timp se preiau datele
  // ==========================================================================
  if (loading) {
    return (
      <div className="dash-loading">
        {/* Inel animat de încărcare (spinner personalizat) */}
        <div className="dash-loading-ring">
          <div className="dash-loading-ring-inner"></div>
        </div>
        <p>Se încarcă panoul...</p>
      </div>
    )
  }

  // ==========================================================================
  // Randarea dashboard-ului
  // ==========================================================================
  return (
    <div className="dash">
      {/* ================================================================= */}
      {/* Header-ul de bun venit - salut + data curentă */}
      {/* ================================================================= */}
      <div className="dash-header">
        <div className="dash-header-text">
          {/* Mesajul de salut (ex: "Bună dimineața") */}
          <p className="dash-greeting">{greeting}</p>
          {/* Titlul paginii */}
          <h1 className="dash-title">Dashboard</h1>
        </div>
        {/* Data curentă formatată în română (ex: "luni, 6 aprilie 2026") */}
        <div className="dash-header-time">
          <span className="dash-date">
            {/* toLocaleDateString formatează data în limba română */}
            {currentTime.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Rândul de statistici - 4 carduri cu contoare */}
      {/* Fiecare card e un link care duce la pagina corespunzătoare */}
      {/* ================================================================= */}
      <div className="dash-stats">
        {/* Card: Număr de categorii */}
        <Link href="/admin/categories" className="dash-stat-card">
          <div className="dash-stat-icon dash-stat-icon-blue">
            <i className="fas fa-folder-open"></i>
          </div>
          <div className="dash-stat-info">
            {/* Valoarea numerică */}
            <span className="dash-stat-value">{stats.categoriesCount}</span>
            {/* Eticheta */}
            <span className="dash-stat-label">Categorii</span>
          </div>
          {/* Săgeata de navigare */}
          <div className="dash-stat-arrow">
            <i className="fas fa-arrow-right"></i>
          </div>
        </Link>

        {/* Card: Număr de fotografii */}
        <Link href="/admin/images" className="dash-stat-card">
          <div className="dash-stat-icon dash-stat-icon-amber">
            <i className="fas fa-images"></i>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.imagesCount}</span>
            <span className="dash-stat-label">Fotografii</span>
          </div>
          <div className="dash-stat-arrow">
            <i className="fas fa-arrow-right"></i>
          </div>
        </Link>

        {/* Card: Număr de hero slides */}
        <Link href="/admin/hero-slider" className="dash-stat-card">
          <div className="dash-stat-icon dash-stat-icon-purple">
            <i className="fas fa-panorama"></i>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.heroSlidesCount}</span>
            <span className="dash-stat-label">Hero Slides</span>
          </div>
          <div className="dash-stat-arrow">
            <i className="fas fa-arrow-right"></i>
          </div>
        </Link>

        {/* Card: Număr de evenimente (fără link, doar informativ) */}
        <div className="dash-stat-card dash-stat-card-highlight">
          <div className="dash-stat-icon dash-stat-icon-green">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-value">{stats.eventsCount}</span>
            <span className="dash-stat-label">Evenimente</span>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Grila principală - conține cardurile cu conținut detaliat */}
      {/* ================================================================= */}
      <div className="dash-grid">
        {/* ============================================================= */}
        {/* Card: Acțiuni rapide - link-uri către cele mai folosite funcții */}
        {/* ============================================================= */}
        <div className="dash-card dash-actions-card">
          <div className="dash-card-header">
            <h2>Acțiuni rapide</h2>
          </div>
          <div className="dash-actions">
            {/* Acțiune: Creează categorie nouă */}
            <Link href="/admin/categories/new" className="dash-action">
              <div className="dash-action-icon">
                <i className="fas fa-folder-plus"></i>
              </div>
              <div>
                <span className="dash-action-title">Categorie nouă</span>
                <span className="dash-action-desc">Adaugă o categorie de fotografii</span>
              </div>
              <i className="fas fa-chevron-right dash-action-arrow"></i>
            </Link>
            {/* Acțiune: Gestionează Hero Slider */}
            <Link href="/admin/hero-slider" className="dash-action">
              <div className="dash-action-icon dash-action-icon-amber">
                <i className="fas fa-panorama"></i>
              </div>
              <div>
                <span className="dash-action-title">Hero Slider</span>
                <span className="dash-action-desc">Gestionează slider-ul de pe homepage</span>
              </div>
              <i className="fas fa-chevron-right dash-action-arrow"></i>
            </Link>
            {/* Acțiune: Gestionează Video Showreel */}
            <Link href="/admin/showreel" className="dash-action">
              <div className="dash-action-icon dash-action-icon-purple">
                <i className="fas fa-video"></i>
              </div>
              <div>
                <span className="dash-action-title">Video Showreel</span>
                <span className="dash-action-desc">Gestionează videoclipul de pe homepage</span>
              </div>
              <i className="fas fa-chevron-right dash-action-arrow"></i>
            </Link>
            {/* Acțiune: Deschide site-ul public într-un tab nou */}
            <a href="/" target="_blank" rel="noopener noreferrer" className="dash-action">
              <div className="dash-action-icon dash-action-icon-green">
                <i className="fas fa-external-link-alt"></i>
              </div>
              <div>
                <span className="dash-action-title">Vezi site-ul</span>
                <span className="dash-action-desc">Deschide website-ul într-un tab nou</span>
              </div>
              <i className="fas fa-chevron-right dash-action-arrow"></i>
            </a>
          </div>
        </div>

        {/* ============================================================= */}
        {/* Card: Previzualizare Hero Slider - arată slide-urile active */}
        {/* ============================================================= */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2>Hero Slider</h2>
            {/* Link către pagina de gestionare a slider-ului */}
            <Link href="/admin/hero-slider" className="dash-card-link">
              Gestionează <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          {/* Dacă există slide-uri, le afișăm ca miniaturi */}
          {heroSlides.length > 0 ? (
            <div className="dash-hero-preview">
              {/* Filtrăm doar slide-urile active și afișăm maxim 4 */}
              {/* .filter(s => s.isActive) = selectăm doar cele active */}
              {/* .slice(0, 4) = luăm primele 4 */}
              {heroSlides.filter(s => s.isActive).slice(0, 4).map((slide) => (
                <div key={slide.id} className="dash-hero-thumb">
                  {/* Imaginea slide-ului (miniatură) */}
                  <Image
                    src={slide.url}
                    alt={slide.alt || 'Slide'}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  {/* Numărul de ordine al slide-ului */}
                  <div className="dash-hero-thumb-order">#{slide.order}</div>
                </div>
              ))}
              {/* Mesaj dacă nu există slide-uri active */}
              {heroSlides.filter(s => s.isActive).length === 0 && (
                <div className="dash-empty-small">
                  <i className="fas fa-panorama"></i>
                  <p>Niciun slide activ</p>
                </div>
              )}
            </div>
          ) : (
            // Mesaj dacă nu există deloc slide-uri
            <div className="dash-empty-small">
              <i className="fas fa-panorama"></i>
              <p>Adaugă imagini în Hero Slider</p>
            </div>
          )}
        </div>

        {/* ============================================================= */}
        {/* Card: Lista de categorii */}
        {/* ============================================================= */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2>Categorii</h2>
            {/* Link către pagina cu toate categoriile */}
            <Link href="/admin/categories" className="dash-card-link">
              Vezi toate <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          {/* Dacă există categorii, le afișăm ca o listă */}
          {categories.length > 0 ? (
            <div className="dash-categories">
              {/* Iterăm prin fiecare categorie */}
              {categories.map((cat) => (
                // Fiecare categorie e un link care duce la pagina de detalii
                <Link key={cat.id} href={`/admin/categories/${cat.id}`} className="dash-category-item">
                  {/* Iconița categoriei */}
                  <div className="dash-category-icon">
                    {cat.icon || <i className="fas fa-folder"></i>}
                  </div>
                  <div className="dash-category-info">
                    {/* Numele categoriei */}
                    <span className="dash-category-name">{cat.name}</span>
                    {/* Numărul total de fotografii din toate evenimentele categoriei */}
                    {/* .reduce() adună toate imaginile din toate evenimentele */}
                    <span className="dash-category-count">
                      {cat.events?.reduce((sum, e) => sum + (e.images?.length || 0), 0) || 0} fotografii
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // Mesaj dacă nu există categorii
            <div className="dash-empty-small">
              <i className="fas fa-folder-open"></i>
              <p>Nicio categorie încă</p>
            </div>
          )}
        </div>

        {/* ============================================================= */}
        {/* Card: Imagini recente - afișează ultimele fotografii adăugate */}
        {/* dash-card-wide = cardul ocupă toată lățimea (2 coloane) */}
        {/* ============================================================= */}
        <div className="dash-card dash-card-wide">
          <div className="dash-card-header">
            <h2>Imagini recente</h2>
            {/* Link către pagina cu toate imaginile */}
            <Link href="/admin/images" className="dash-card-link">
              Vezi toate <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          {/* Dacă există imagini recente, le afișăm ca miniaturi */}
          {recentImages.length > 0 ? (
            <div className="dash-recent-images">
              {/* Afișăm maxim 6 imagini recente */}
              {/* .slice(0, 6) = luăm primele 6 din array */}
              {recentImages.slice(0, 6).map((img) => (
                <div key={img.id} className="dash-recent-img">
                  {/* Imaginea (folosim thumbnailUrl pentru viteză, sau url-ul complet) */}
                  <Image
                    src={img.thumbnailUrl || img.url}
                    alt={img.alt || 'Image'}
                    fill
                    sizes="150px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            // Mesaj dacă nu există imagini
            <div className="dash-empty-small">
              <i className="fas fa-images"></i>
              <p>Nicio imagine încă</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
