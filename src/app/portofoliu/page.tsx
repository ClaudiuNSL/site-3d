// =============================================
// PAGINA PORTOFOLIU (portofoliu/page.tsx)
// Aceasta este pagina dedicată portofoliului fotografului
// Afișează toate categoriile de fotografii cu galerie și lightbox
// Lightbox = vizualizare imagine pe tot ecranul
// =============================================

// 'use client' = această componentă rulează în browser (client-side)
// Necesar pentru useState, useEffect, useCallback (interactivitate)
'use client'

// Image = componenta Next.js optimizată pentru imagini (încarcă mai rapid)
import Image from 'next/image'
// Link = componenta Next.js pentru navigare între pagini (mai rapidă decât <a>)
import Link from 'next/link'
// useState = hook React pentru a stoca date care se schimbă (stare/state)
// useEffect = hook React pentru cod care rulează după afișarea paginii
// useCallback = hook React pentru a memora o funcție (optimizare performanță)
import { useState, useEffect, useCallback } from 'react'
// Category = tipul TypeScript care descrie structura unei categorii
import { Category } from '@/types'
// Importăm stilurile CSS ale site-ului
import '../styles.css'

// =============================================
// ICONIȚE CATEGORII
// Obiect care leagă slug-ul categoriei (ex: 'nunta') de clasa Font Awesome
// Record<string, string> = un obiect cu chei string și valori string
// =============================================
const categoryIcons: Record<string, string> = {
  'nunta': 'fas fa-ring',
  'botez': 'fas fa-baby',
  'save-the-date': 'fas fa-heart',
  'cuplu': 'fas fa-hand-holding-heart',
  'familie': 'fas fa-users',
  'trash-the-dress': 'fas fa-magic',
  'absolvire': 'fas fa-graduation-cap',
  'profesional': 'fas fa-briefcase',
  'fotografii-amuzante': 'fas fa-theater-masks',
}

// =============================================
// COMPONENTA CATEGORY ICON
// Afișează iconița potrivită pentru fiecare categorie
// slug = identificatorul categoriei (ex: 'nunta', 'botez')
// fallbackIcon = iconița de rezervă (dacă nu există una predefinită)
// =============================================
function CategoryIcon({ slug, fallbackIcon }: { slug: string; fallbackIcon?: string | null }) {
  // Căutăm iconița în obiectul categoryIcons
  const iconClass = categoryIcons[slug]
  // Dacă am găsit o iconiță, o afișăm
  if (iconClass) {
    return <i className={iconClass}></i>
  }
  // Dacă nu, dar avem o iconiță de rezervă (fallback), o folosim pe aceea
  if (fallbackIcon) {
    return <span>{fallbackIcon}</span>
  }
  // Dacă nu avem nimic, afișăm iconița generică de cameră
  return <i className="fa-solid fa-camera"></i>
}

// =============================================
// COMPONENTA PRINCIPALĂ - PAGINA PORTOFOLIU
// Aceasta este funcția principală care afișează toată pagina
// =============================================
export default function PortofoliuPage() {
  // useState = "stare" - variabile care când se schimbă, React redesenează pagina
  // categories = lista de categorii încărcate din baza de date
  // setCategories = funcția care modifică lista de categorii
  const [categories, setCategories] = useState<Category[]>([])

  // activeCategoryIndex = indexul categoriei selectate (0 = prima, 1 = a doua, etc.)
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)

  // loading = dacă datele se încarcă (true = se încarcă, false = s-au încărcat)
  const [loading, setLoading] = useState(true)

  // lightboxIndex = indexul imaginii deschise în lightbox (null = lightbox închis)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // =============================================
  // ÎNCĂRCARE DATE DIN API
  // useEffect = cod care rulează DUPĂ ce pagina s-a afișat
  // [] la final = rulează o singură dată (la prima încărcare a paginii)
  // =============================================
  useEffect(() => {
    // Funcție asincronă (async) = poate aștepta răspunsuri de la server
    const fetchCategories = async () => {
      try {
        // fetch = trimite o cerere HTTP către server pentru a obține categoriile
        const response = await fetch('/api/categories')
        // response.ok = true dacă serverul a răspuns cu succes (cod 200)
        if (response.ok) {
          // Convertim răspunsul din JSON în obiect JavaScript
          const data = await response.json()
          // Salvăm categoriile în starea componentei
          setCategories(data)
        }
      } catch (error) {
        // Dacă apare o eroare (ex: fără internet), o afișăm în consolă
        console.error('Error fetching categories:', error)
      } finally {
        // finally = se execută MEREU, indiferent dacă a fost eroare sau nu
        // Oprim indicatorul de încărcare
        setLoading(false)
      }
    }
    // Apelăm funcția de încărcare
    fetchCategories()
  }, [])

  // =============================================
  // PREGĂTIREA IMAGINILOR PENTRU AFIȘARE
  // Luăm categoria activă și extragem toate imaginile din evenimentele ei
  // =============================================

  // Categoria curentă selectată (pe baza indexului activ)
  const activeCategory = categories[activeCategoryIndex]

  // Extragem toate imaginile din toate evenimentele categoriei active
  // flatMap = parcurge fiecare eveniment și "aplatizează" (combină) toate imaginile într-o singură listă
  // || [] = dacă nu există evenimente/imagini, folosim o listă goală
  const images = activeCategory?.events?.flatMap(event =>
    (event.images || []).map(img => ({
      url: img.url,                                    // URL-ul imaginii originale (rezoluție mare)
      thumbnailUrl: img.thumbnailUrl || img.url,       // URL-ul thumbnail-ului (imagine mică, pentru galerie)
      alt: img.alt || activeCategory.name,             // Textul alternativ (pentru accesibilitate)
      eventName: event.name,                           // Numele evenimentului din care face parte
    }))
  ) || []

  // =============================================
  // FUNCȚII LIGHTBOX
  // Lightbox = vizualizare imagine pe tot ecranul
  // =============================================

  // Deschide lightbox-ul la imaginea cu indexul dat
  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    // Dezactivează scroll-ul pe pagină când lightbox-ul e deschis
    document.body.style.overflow = 'hidden'
  }

  // Închide lightbox-ul
  const closeLightbox = () => {
    setLightboxIndex(null)
    // Reactivează scroll-ul pe pagină
    document.body.style.overflow = 'auto'
  }

  // useCallback = memorează funcția ca să nu se recreeze la fiecare randare
  // Navighează la imaginea anterioară
  const goToPrev = useCallback(() => {
    // Dacă lightbox-ul nu e deschis sau nu avem imagini, nu facem nimic
    if (lightboxIndex === null || images.length === 0) return
    // Dacă suntem la prima imagine (index 0), mergem la ultima; altfel, mergem cu una înapoi
    setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1)
  }, [lightboxIndex, images.length])

  // Navighează la imaginea următoare
  const goToNext = useCallback(() => {
    if (lightboxIndex === null || images.length === 0) return
    // Dacă suntem la ultima imagine, mergem la prima; altfel, mergem cu una înainte
    setLightboxIndex(lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1)
  }, [lightboxIndex, images.length])

  // =============================================
  // NAVIGARE CU TASTATURA ÎN LIGHTBOX
  // Permite navigarea cu săgețile stânga/dreapta și închiderea cu Escape
  // =============================================
  useEffect(() => {
    // Funcție care se apelează când utilizatorul apasă o tastă
    const handleKeyDown = (e: KeyboardEvent) => {
      // Doar dacă lightbox-ul este deschis
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowLeft') goToPrev()    // Săgeata stânga = imaginea anterioară
        if (e.key === 'ArrowRight') goToNext()   // Săgeata dreapta = imaginea următoare
        if (e.key === 'Escape') closeLightbox()  // Escape = închide lightbox-ul
      }
    }
    // Adăugăm ascultătorul de tastă pe fereastră
    window.addEventListener('keydown', handleKeyDown)
    // Cleanup: eliminăm ascultătorul când componenta se dezactivează
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, goToPrev, goToNext])

  // =============================================
  // AFIȘAREA PAGINII (JSX)
  // Tot ce este mai jos este structura vizuală a paginii
  // =============================================
  return (
    <div className="portfolio-page">

      {/* =============================================
          HEADER-UL PAGINII PORTOFOLIU
          Conține titlul "Portofoliu" și butonul de întoarcere "Acasă"
          ============================================= */}
      <header className="portfolio-header">
        <div className="portfolio-header-inner">
          <div>
            <h1>Portofoliu</h1>
            <p>Colecția mea de momente speciale</p>
          </div>
          {/* Link = navigare către pagina principală ("/") */}
          <Link href="/" className="portfolio-back">
            <i className="fas fa-arrow-left"></i>
            <span>Acasă</span>
          </Link>
        </div>
      </header>

      <div className="portfolio-layout">

        {/* =============================================
            BARA LATERALĂ CU CATEGORII (ASIDE)
            Lista de butoane pentru fiecare categorie (Nuntă, Botez, etc.)
            ============================================= */}
        <aside className="portfolio-aside">
          <h3>Categorii</h3>
          <nav className="portfolio-aside-nav">
            {/* .map() = parcurgem fiecare categorie și creăm un buton pentru ea */}
            {categories.map((category, index) => (
              <button
                key={category.id}
                // Adăugăm clasa 'portfolio-aside-active' dacă acest buton e selectat
                className={`portfolio-aside-item ${index === activeCategoryIndex ? 'portfolio-aside-active' : ''}`}
                // La click: schimbăm categoria activă și închidem lightbox-ul
                onClick={() => { setActiveCategoryIndex(index); setLightboxIndex(null) }}
              >
                {/* Iconița categoriei */}
                <span className="portfolio-aside-icon">
                  <CategoryIcon slug={category.slug} fallbackIcon={category.icon} />
                </span>
                <div className="portfolio-aside-text">
                  {/* Numele categoriei */}
                  <span className="portfolio-aside-name">{category.name}</span>
                  {/* Numărul total de fotografii din categorie */}
                  {/* .reduce() = adună toate imaginile din toate evenimentele */}
                  <span className="portfolio-aside-count">
                    {category.events?.reduce((sum, e) => sum + (e.images?.length || 0), 0) || 0} fotografii
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* =============================================
            ZONA PRINCIPALĂ CU GRILA DE FOTOGRAFII
            Afișează imaginile din categoria selectată
            ============================================= */}
        <main className="portfolio-grid-area">
          {/* Dacă se încarcă datele, afișăm un spinner */}
          {loading ? (
            <div className="portfolio-loading">
              <div className="slider-spinner"></div>
            </div>
          ) : images.length > 0 ? (
            // Dacă avem imagini, le afișăm într-o grilă
            <>
              {/* Header-ul grilei cu numele categoriei și numărul de fotografii */}
              <div className="portfolio-grid-header">
                <h2>{activeCategory?.name}</h2>
                <span>{images.length} fotografii</span>
              </div>
              {/* Grila de imagini */}
              <div className="portfolio-grid">
                {/* .map() = parcurgem fiecare imagine și o afișăm */}
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="portfolio-item"
                    // La click pe imagine, deschidem lightbox-ul
                    onClick={() => openLightbox(index)}
                  >
                    {/* Componenta Image din Next.js pentru afișarea optimizată */}
                    {/* fill = imaginea umple containerul părinte */}
                    {/* sizes = indică browserului ce dimensiune să descarce */}
                    <Image
                      src={img.thumbnailUrl}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="portfolio-item-image"
                    />
                    {/* Overlay = stratul semi-transparent care apare la hover */}
                    <div className="portfolio-item-overlay">
                      <span>{img.eventName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Dacă NU avem imagini, afișăm un mesaj
            <div className="portfolio-empty">
              <i className="fas fa-camera"></i>
              <p>Fotografii în curând pentru această categorie</p>
            </div>
          )}
        </main>
      </div>

      {/* =============================================
          LIGHTBOX - VIZUALIZARE IMAGINE PE TOT ECRANUL
          Apare doar când lightboxIndex nu este null
          ============================================= */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        // Fundalul întunecat - click pe el închide lightbox-ul
        <div className="portfolio-lightbox" onClick={closeLightbox}>
          {/* Butonul X de închidere */}
          <button className="lightbox-close-btn" onClick={closeLightbox}>
            <i className="fas fa-times"></i>
          </button>

          {/* Butonul săgeată stânga (imaginea anterioară) */}
          {/* e.stopPropagation() = oprește click-ul să închidă lightbox-ul */}
          <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); goToPrev() }}>
            <i className="fas fa-chevron-left"></i>
          </button>

          {/* Imaginea mare din lightbox */}
          <div className="lightbox-image-wrapper" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt}
              fill
              sizes="90vw"
              quality={95}
              className="lightbox-main-image"
            />
          </div>

          {/* Butonul săgeată dreapta (imaginea următoare) */}
          <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); goToNext() }}>
            <i className="fas fa-chevron-right"></i>
          </button>

          {/* Contor - arată câta imagine din total (ex: "3 / 15") */}
          <div className="lightbox-counter">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  )
}
