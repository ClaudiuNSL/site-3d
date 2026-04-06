// =============================================
// PAGINA PRINCIPALĂ (page.tsx) - HOMEPAGE
// Aceasta este pagina de acasă a site-ului de fotografie
// Conține toate secțiunile: hero slider, statistici, showreel,
// galerie mozaic, pachete servicii, contact și footer
// Este cel mai mare și complex fișier din aplicație
// =============================================

// 'use client' = spune Next.js că această componentă rulează în BROWSER (client-side)
// Este necesar pentru orice componentă care folosește useState, useEffect, onClick, etc.
'use client'

// Importăm componenta CategoryViewModal - popup-ul care se deschide la click pe o categorie
import CategoryViewModal from '@/components/CategoryViewModal'
// Importăm componenta AboutModal - popup-ul "Despre Mine"
import AboutModal from '@/components/AboutModal'
// Importăm tipurile TypeScript - descriu structura datelor folosite în aplicație
// Category = o categorie de fotografii (ex: Nuntă, Botez)
// HeroSlide = un slide din slideshow-ul principal
// ShowreelVideo = videoul showreel de prezentare
// Package = un pachet de servicii foto-video
import { Category, HeroSlide, ShowreelVideo, Package } from '@/types'
// Image = componenta Next.js optimizată pentru imagini (încarcă mai rapid, redimensionare automată)
import Image from 'next/image'
// Link = componenta Next.js pentru navigare între pagini (mai rapidă decât <a href>)
import Link from 'next/link'
// Importăm hook-urile React necesare:
// useEffect = rulează cod după ce pagina s-a afișat
// useState = stochează date care se schimbă (și re-randează pagina)
// useRef = referință la un element DOM (nu re-randează pagina)
// useCallback = memorează o funcție (optimizare performanță)
import { useEffect, useState, useRef, useCallback } from 'react'
// Importăm stilurile CSS ale site-ului
import './styles.css'

// =============================================
// ICONIȚE CATEGORII (Font Awesome)
// Un obiect care leagă slug-ul categoriei de clasa CSS Font Awesome
// Record<string, string> = tip TypeScript - un obiect cu chei și valori de tip string
// Exemplu: 'nunta' -> 'fas fa-ring' (iconița de inel)
// =============================================
const categoryIcons: Record<string, string> = {
  'nunta': 'fas fa-ring',                     // Inel pentru nuntă
  'botez': 'fas fa-baby',                     // Bebeluș pentru botez
  'save-the-date': 'fas fa-heart',            // Inimă pentru save the date
  'cuplu': 'fas fa-hand-holding-heart',       // Mâini ținându-se pentru cuplu
  'familie': 'fas fa-users',                  // Grup de persoane pentru familie
  'trash-the-dress': 'fas fa-magic',          // Baghetă magică pentru trash the dress
  'absolvire': 'fas fa-graduation-cap',       // Toca pentru absolvire
  'profesional': 'fas fa-briefcase',          // Servietă pentru profesional
  'fotografii-amuzante': 'fas fa-theater-masks', // Măști de teatru pentru amuzante
}

// =============================================
// COMPONENTA CATEGORY ICON
// Afișează iconița potrivită pentru fiecare categorie
// Primește slug-ul categoriei și o iconiță de rezervă (fallback)
// =============================================
function CategoryIcon({ slug, fallbackIcon }: { slug: string; fallbackIcon?: string | null }) {
  // Căutăm clasa CSS a iconiței în obiectul categoryIcons
  const iconClass = categoryIcons[slug]
  // Dacă am găsit o iconiță predefinită, o afișăm
  if (iconClass) {
    return <i className={iconClass}></i>
  }
  // Dacă nu, dar avem o iconiță de rezervă, o folosim pe aceea
  if (fallbackIcon) {
    return <span>{fallbackIcon}</span>
  }
  // Dacă nu avem nimic, afișăm iconița generică de cameră foto
  return <i className="fa-solid fa-camera"></i>
}

// =============================================
// HOOK PERSONALIZAT: useCountUp
// Creează o animație de numărare (ex: 0 -> 500+)
// end = valoarea finală la care numără
// duration = cât durează animația (în milisecunde, 2000 = 2 secunde)
// start = când să înceapă animația (true/false)
// suffix = text adăugat la final (ex: '+')
// =============================================
function useCountUp(end: number, duration: number, start: boolean, suffix = '') {
  // useState = starea curentă a numărului afișat (inițial "0" + suffix)
  const [count, setCount] = useState('0' + suffix)

  // useEffect = rulează animația când "start" devine true
  useEffect(() => {
    // Dacă animația nu trebuie să înceapă, nu facem nimic
    if (!start) return

    // startTime = momentul în care animația a început
    let startTime: number

    // Funcția de animație - se apelează la fiecare cadru (frame) de animație (~60fps)
    const animate = (timestamp: number) => {
      // La prima apelare, salvăm momentul de start
      if (!startTime) startTime = timestamp

      // Calculăm progresul: 0 = început, 1 = complet
      // Math.min asigură că nu depășim 1
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // easeOutCubic = funcție de "relaxare" - animația e rapidă la început, lentă la final
      // Dă o senzație mai naturală decât o animație liniară
      const eased = 1 - Math.pow(1 - progress, 3)

      // Calculăm valoarea curentă (între 0 și end)
      const current = Math.floor(eased * end)

      // Dacă valoarea e >= 1000, o afișăm ca "Xk" (ex: 50000 -> "50k")
      if (end >= 1000) {
        setCount(Math.floor(current / 1000) + 'k' + suffix)
      } else {
        setCount(current + suffix)
      }

      // Dacă animația nu s-a terminat, continuă la următorul frame
      if (progress < 1) requestAnimationFrame(animate)
    }

    // Pornește animația
    requestAnimationFrame(animate)
  }, [start, end, duration, suffix]) // Dependențe: re-rulează dacă acestea se schimbă

  // Returnează valoarea curentă de afișat
  return count
}

// =============================================
// FUNCȚII AJUTĂTOARE PENTRU VIDEO
// Aceste funcții extrag informații din URL-uri YouTube/Vimeo
// =============================================

// Extrage ID-ul YouTube dintr-un URL
// Funcționează cu: youtube.com/watch?v=..., youtube.com/embed/..., youtu.be/...
function getYouTubeId(url: string) {
  // Regex (expresie regulată) = un șablon care caută un anumit pattern în text
  // Caută un ID de 11 caractere alfanumerice după formatul YouTube
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  // Dacă am găsit un match, returnăm ID-ul (grupul 1), altfel null
  return match ? match[1] : null
}

// Generează URL-ul de embed (încorporare) pentru un video
// Adaugă parametri precum autoplay, fără controale, etc.
function getEmbedUrl(url: string) {
  const ytId = getYouTubeId(url)
  // Dacă e YouTube, construim URL-ul de embed cu parametri
  if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=0&iv_load_policy=3&disablekb=1`
  // Verificăm dacă e un URL Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
  // Dacă nu e nici YouTube, nici Vimeo, returnăm URL-ul original
  return url
}

// Generează URL-ul thumbnail-ului (imagine de preview) pentru un video YouTube
function getYouTubeThumbnail(url: string) {
  const ytId = getYouTubeId(url)
  // YouTube oferă thumbnail-uri la URL-uri standard
  if (ytId) return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
  return null
}

// =============================================
// COMPONENTA PRINCIPALĂ HOME - PAGINA DE ACASĂ
// Aceasta este funcția care generează întreaga pagină de acasă
// export default = poate fi importată din alte fișiere
// =============================================
export default function Home() {

  // =============================================
  // DECLARAREA STĂRILOR (useState)
  // Fiecare useState creează o variabilă și o funcție de modificare
  // Când valoarea se schimbă, React redesenează automat pagina
  // =============================================

  // categories = lista de categorii de fotografii încărcate din baza de date
  // setCategories = funcția care modifică lista
  const [categories, setCategories] = useState<Category[]>([])

  // heroSlides = imaginile din slideshow-ul principal (hero)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])

  // selectedCategory = categoria selectată pentru popup (null = nicio categorie selectată)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // loading = dacă datele se încarcă (true = se încarcă, false = gata)
  const [loading, setLoading] = useState(true)

  // isAboutModalOpen = dacă popup-ul "Despre Mine" este deschis
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

  // activeSlide = indexul slide-ului curent din hero slider (0 = primul)
  const [activeSlide, setActiveSlide] = useState(0)

  // sliderPaused = dacă sliderul auto-play e pus pe pauză (la hover)
  const [sliderPaused, setSliderPaused] = useState(false)

  // preloaderDone = dacă animația de preîncărcare s-a terminat
  const [preloaderDone, setPreloaderDone] = useState(false)

  // statsVisible = dacă secțiunea de statistici este vizibilă pe ecran
  // Folosită pentru a porni animația de numărare
  const [statsVisible, setStatsVisible] = useState(false)

  // parallaxOffset = cât de mult se deplasează textul hero la scroll (efect parallax)
  const [parallaxOffset, setParallaxOffset] = useState(0)

  // activePackage = indexul pachetului de servicii activ (selectat)
  const [activePackage, setActivePackage] = useState(0)

  // showreelVideo = datele videoului showreel (null = nu există)
  const [showreelVideo, setShowreelVideo] = useState<ShowreelVideo | null>(null)

  // showreelPlaying = dacă videoul showreel este în redare
  const [showreelPlaying, setShowreelPlaying] = useState(false)

  // packages = lista de pachete de servicii foto-video
  const [packages, setPackages] = useState<Package[]>([])


  // useRef = creează o referință la un element HTML din pagină
  // statsRef = referință la secțiunea de statistici (pentru a detecta când e vizibilă)
  // useRef NU re-randează pagina când se schimbă (spre deosebire de useState)
  const statsRef = useRef<HTMLElement>(null)

  // =============================================
  // ANIMAȚII DE NUMĂRARE (COUNT-UP)
  // Folosim hook-ul useCountUp creat mai sus
  // Fiecare numără de la 0 la o valoare, în 2 secunde, când statsVisible devine true
  // =============================================
  const count1 = useCountUp(500, 2000, statsVisible, '+')      // 500+ Evenimente
  const count2 = useCountUp(8, 2000, statsVisible)              // 8 Ani Experiență
  const count3 = useCountUp(1000, 2000, statsVisible, '+')     // 1000+ Clienți Fericiți
  const count4 = useCountUp(50000, 2000, statsVisible, '+')    // 50k+ Fotografii Livrate

  // =============================================
  // ÎNCĂRCARE DATE DIN API (useEffect)
  // useEffect = cod care rulează DUPĂ ce pagina s-a afișat
  // [] la final = rulează o singură dată (la prima încărcare)
  // =============================================
  useEffect(() => {
    // Funcție asincronă = poate "aștepta" (await) răspunsuri de la server
    const fetchData = async () => {
      try {
        // Promise.all = trimite TOATE cererile în paralel (simultan, nu una după alta)
        // Aceasta e mai rapidă decât a le trimite secvențial
        // fetch = trimite cerere HTTP GET către server
        const [catRes, heroRes, showreelRes, pkgRes] = await Promise.all([
          fetch('/api/categories'),     // Obține categoriile
          fetch('/api/hero-slides'),    // Obține slide-urile hero
          fetch('/api/showreel'),       // Obține datele showreel
          fetch('/api/packages'),       // Obține pachetele de servicii
        ])
        // Dacă răspunsul e OK (status 200), salvăm datele în stare
        if (catRes.ok) setCategories(await catRes.json())     // .json() = convertim din JSON în obiect JS
        if (heroRes.ok) setHeroSlides(await heroRes.json())
        if (showreelRes.ok) {
          const data = await showreelRes.json()
          if (data) setShowreelVideo(data)
        }
        if (pkgRes.ok) setPackages(await pkgRes.json())
      } catch (error) {
        // Dacă apare o eroare (ex: fără internet), o afișăm în consolă
        console.error('Error fetching data:', error)
      } finally {
        // finally = se execută MEREU (indiferent de succes sau eroare)
        // Oprim indicatorul de încărcare
        setLoading(false)
      }
    }

    // Apelăm funcția de încărcare
    fetchData()
  }, [])

  // =============================================
  // FUNCȚII PENTRU GESTIONAREA CLICK-URILOR PE CATEGORII
  // =============================================

  // Când utilizatorul dă click pe un card de categorie
  const handleCategoryClick = (category: Category) => {
    // Salvăm categoria selectată (va deschide CategoryViewModal)
    setSelectedCategory(category)
    // Dezactivăm scroll-ul pe pagină (ca să nu poți scrola în spatele modalului)
    document.body.style.overflow = 'hidden'
  }

  // Când utilizatorul închide modalul de categorie
  const closeModal = () => {
    // Resetăm categoria selectată (va închide CategoryViewModal)
    setSelectedCategory(null)
    // Reactivăm scroll-ul pe pagină
    document.body.style.overflow = 'auto'
  }

  // =============================================
  // FUNCȚII PENTRU MODALUL "DESPRE MINE"
  // useCallback = memorează funcția (nu o recreează la fiecare randare)
  // Necesar pentru că e folosită ca dependență în useEffect
  // =============================================
  const openAboutModal = useCallback(() => {
    setIsAboutModalOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeAboutModal = () => {
    setIsAboutModalOpen(false)
    document.body.style.overflow = 'auto'
  }

  // =============================================
  // PREGĂTIREA SLIDE-URILOR HERO
  // Combinăm slide-ul implicit (hero-image.png) cu cele din admin
  // =============================================

  // Slide-ul de bază (fallback) - folosit mereu ca prim slide
  const fallbackSlide = {
    url: '/assets/images/hero-image.png',
    alt: 'Banciu Costin Photography',
    title: '',
    isHero: true    // isHero = true înseamnă că este slide-ul principal cu text overlay
  }

  // Formatăm slide-urile din admin într-un format unitar
  const heroSlidesFormatted = heroSlides.map(slide => ({
    url: slide.url,
    alt: slide.alt || '',
    title: slide.title || '',
    isHero: false    // isHero = false = sunt slide-uri portofoliu
  }))

  // Combinăm: slide-ul de bază + slide-urile din admin
  // Dacă nu avem slide-uri din admin, folosim doar slide-ul de bază
  const allSlides = heroSlidesFormatted.length > 0
    ? [fallbackSlide, ...heroSlidesFormatted]    // ... = spread operator, combină listele
    : [fallbackSlide]

  // =============================================
  // FUNCȚII DE NAVIGARE ÎN SLIDER
  // =============================================

  // Navigare la slide-ul anterior
  const goToPrevSlide = () => {
    // prev = valoarea curentă a stării
    // Dacă suntem la primul slide (0), mergem la ultimul; altfel, mergem cu 1 înapoi
    setActiveSlide(prev => prev === 0 ? allSlides.length - 1 : prev - 1)
  }

  // Navigare la slide-ul următor
  const goToNextSlide = () => {
    // Dacă suntem la ultimul slide, mergem la primul (0); altfel, mergem cu 1 înainte
    setActiveSlide(prev => prev === allSlides.length - 1 ? 0 : prev + 1)
  }

  // =============================================
  // AUTO-PLAY SLIDER
  // Schimbă automat slide-ul la fiecare 3 secunde
  // Se oprește când mouse-ul este pe slider (sliderPaused = true)
  // =============================================
  useEffect(() => {
    // Dacă sliderul e pe pauză sau avem doar 1 slide, nu facem nimic
    if (sliderPaused || allSlides.length <= 1) return
    // setInterval = execută o funcție repetat la un interval specificat
    // 3000 = 3000 milisecunde = 3 secunde
    const interval = setInterval(() => {
      setActiveSlide(prev => prev === allSlides.length - 1 ? 0 : prev + 1)
    }, 3000)
    // Cleanup: când componenta se re-randează, oprim intervalul vechi
    // clearInterval = oprește repetarea
    return () => clearInterval(interval)
  }, [sliderPaused, allSlides.length])

  // =============================================
  // PRELOADER ȘI SCROLL LA ÎNCEPUT
  // Preloader = animația de încărcare care apare la prima vizită
  // =============================================
  useEffect(() => {
    // Dezactivăm restaurarea automată a scroll-ului de către browser
    window.history.scrollRestoration = 'manual'
    // Forțăm scroll-ul la începutul paginii
    window.scrollTo(0, 0)
    // După 2.2 secunde, marcăm preloader-ul ca terminat
    // setTimeout = execută o funcție o singură dată, după un delay
    const timer = setTimeout(() => setPreloaderDone(true), 2200)
    // Cleanup: dacă componenta se dezactivează, oprim timer-ul
    return () => clearTimeout(timer)
  }, [])

  // =============================================
  // EFECTE DE SCROLL, PARALLAX, STATISTICI, MENIU, FORMULAR
  // Acest useEffect mare gestionează toate interacțiunile cu pagina
  // =============================================
  useEffect(() => {

    // === Scroll Reveal (Dezvăluire la Scroll) ===
    // Găsește toate elementele cu clasa "reveal" și le observă
    // Când un element devine vizibil pe ecran, adaugă clasa "revealed" (care activează animația CSS)
    const revealElements = document.querySelectorAll('.reveal')
    // IntersectionObserver = API browser care detectează când un element intră în zona vizibilă
    // threshold: 0.15 = elementul trebuie să fie vizibil cel puțin 15% ca să declanșeze
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    }, { threshold: 0.15 })
    // Observăm fiecare element cu clasa "reveal"
    revealElements.forEach(el => revealObserver.observe(el))

    // === Observer pentru Secțiunea de Statistici ===
    // Detectează când secțiunea de statistici devine vizibilă
    // La primul moment în care e vizibilă, pornește animațiile de numărare
    const statsEl = statsRef.current
    if (statsEl) {
      const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true)           // Pornește animația de numărare
          statsObserver.disconnect()      // Se deconectează (animația pornește o singură dată)
        }
      }, { threshold: 0.5 })   // threshold: 0.5 = 50% din element trebuie să fie vizibil
      statsObserver.observe(statsEl)
    }

    // === Efect Parallax pe Textul Hero ===
    // Parallax = textul se mișcă mai lent decât scroll-ul, creând un efect de adâncime
    const handleScroll = () => {
      const scrollY = window.scrollY    // Cât a scrolat utilizatorul (în pixeli)
      setParallaxOffset(scrollY * 0.4)  // Textul se mișcă cu 40% din viteza scroll-ului

      // Schimbă fundalul navbar-ului când utilizatorul scrolează
      const navbar = document.querySelector('.navbar')
      if (scrollY > 50) {
        navbar?.classList.add('scrolled')      // Adaugă fundal la navbar
      } else {
        navbar?.classList.remove('scrolled')   // Elimină fundalul (transparent)
      }
    }
    // Adăugăm ascultătorul de scroll pe fereastră
    window.addEventListener('scroll', handleScroll)

    // === Meniu Hamburger (pentru mobil) ===
    // Hamburger = cele 3 linii orizontale din meniu pe telefon
    const hamburger = document.querySelector('.hamburger')
    const navMenu = document.querySelector('.nav-menu')
    const socialIcons = document.querySelector('.social-icons')

    // Funcție care deschide/închide meniul mobil
    // classList.toggle = adaugă clasa dacă nu există, o elimină dacă există
    const toggleMobileMenu = () => {
      hamburger?.classList.toggle('active')
      navMenu?.classList.toggle('active')
      socialIcons?.classList.toggle('active')
    }

    // Adăugăm event listener pe butonul hamburger
    hamburger?.addEventListener('click', toggleMobileMenu)

    // Închide meniul mobil când utilizatorul dă click pe un link din meniu
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger?.classList.remove('active')
        navMenu?.classList.remove('active')
        socialIcons?.classList.remove('active')
      })
    })

    // === Smooth Scrolling (Scroll lin) pentru link-urile de navigare ===
    // Când dai click pe un link din meniu, pagina scrolează lin la secțiunea respectivă
    const handleNavClick = (e: Event) => {
      e.preventDefault()    // Previne comportamentul implicit al link-ului
      const target = e.target as HTMLAnchorElement
      const targetId = target.getAttribute('href')    // Obține href-ul (ex: '#despre')

      // Dacă link-ul e '#despre', deschidem modalul About
      if (targetId === '#despre') {
        openAboutModal()
        return
      }

      // Dacă link-ul e '#portofoliu', navigăm la pagina Portofoliu
      if (targetId === '#portofoliu') {
        window.location.href = '/portofoliu'
        return
      }

      // Pentru alte link-uri, scrolăm lin la secțiunea cu acel ID
      const targetSection = document.querySelector(targetId!)
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',    // Scroll lin (animat)
          block: 'start'         // Secțiunea se aliniază la începutul ecranului
        })
      }
    }

    // Adăugăm ascultătorul de click pe toate link-urile de navigare
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', handleNavClick)
    })

    // === Gestionarea Formularului de Contact ===
    const contactForm = document.getElementById('contact-form') as HTMLFormElement

    // Funcție care se apelează când formularul este trimis (submit)
    const handleFormSubmit = async (e: Event) => {
      e.preventDefault()    // Previne reîncărcarea paginii (comportamentul implicit)

      // Extragem datele din formular
      const formData = new FormData(contactForm)
      // Object.fromEntries = transformă FormData într-un obiect simplu {name: 'val', email: 'val'}
      const data = Object.fromEntries(formData)

      // Validare: verificăm dacă toate câmpurile obligatorii sunt completate
      if (!data.name || !data.email || !data.phone || !data.service) {
        showNotification('Te rog să completezi toate câmpurile obligatorii.', 'error')
        return
      }

      // Validare email: verificăm formatul cu regex (expresie regulată)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email as string)) {
        showNotification('Te rog să introduci o adresă de email validă.', 'error')
        return
      }

      // Validare telefon: verificăm formatul (minim 10 cifre, poate include +, spații, etc.)
      const phoneRegex = /^[\+]?[0-9\s\-()]{10,}$/
      if (!phoneRegex.test(data.phone as string)) {
        showNotification('Te rog să introduci un număr de telefon valid.', 'error')
        return
      }

      // Schimbăm butonul de submit să arate un spinner (indicatorul de încărcare)
      const submitBtn = contactForm.querySelector('.ct-submit') as HTMLButtonElement
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Se trimite...'
      submitBtn.disabled = true    // Dezactivăm butonul (să nu dea click de mai multe ori)

      try {
        // Trimitem datele către server prin POST request
        const response = await fetch('/api/contact', {
          method: 'POST',                                    // Metoda HTTP POST (trimite date)
          headers: { 'Content-Type': 'application/json' },   // Spunem serverului că trimitem JSON
          body: JSON.stringify(data),                         // Convertim datele în JSON
        })

        if (response.ok) {
          // Dacă totul e OK, resetăm formularul și afișăm mesaj de succes
          contactForm.reset()
          showNotification('Mulțumesc pentru mesaj! Voi reveni cu un răspuns în cel mai scurt timp.', 'success')
        } else {
          // Dacă serverul a returnat o eroare, o afișăm
          const error = await response.json()
          showNotification(error.error || 'A apărut o eroare. Te rog încearcă din nou.', 'error')
        }
      } catch (error) {
        // Dacă a fost o eroare de rețea
        console.error('Error submitting form:', error)
        showNotification('A apărut o eroare la trimiterea mesajului. Verifică conexiunea la internet.', 'error')
      } finally {
        // Restaurăm butonul la starea inițială
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      }
    }

    // Adăugăm ascultătorul de submit pe formular (doar dacă formularul există)
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit)
    }

    // === Gestionarea Tastei Escape pentru Modale ===
    const handleKeyDown = (e: KeyboardEvent) => {
      // Dacă tasta Escape e apăsată și un modal de categorie e deschis, îl închidem
      if (e.key === 'Escape' && selectedCategory) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    // === Funcția de Notificări ===
    // Creează și afișează o notificare temporară (toast) pe ecran
    // message = textul mesajului
    // type = tipul notificării: 'success' (verde), 'error' (roșu), 'info' (albastru)
    const showNotification = (message: string, type = 'info') => {
      // Eliminăm orice notificări existente (ca să nu se suprapună)
      const existingNotifications = document.querySelectorAll('.notification')
      existingNotifications.forEach(notification => notification.remove())

      // Creăm un nou element div pentru notificare
      const notification = document.createElement('div')
      notification.className = `notification notification-${type}`
      // innerHTML = conținutul HTML al notificării
      // Include o iconiță (diferită pe tip), mesajul și un buton X de închidere
      notification.innerHTML = `
        <div class="notification-content">
          <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
          <span>${message}</span>
          <button class="notification-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `

      // Stilurile CSS ale notificării
      // position: fixed = fixă pe ecran (nu se mișcă la scroll)
      // top: 100px, right: 20px = în colțul dreapta sus
      notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 4000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
      `

      // Stiluri pentru conținutul notificării (layout flexbox)
      const notificationContent = notification.querySelector('.notification-content') as HTMLElement
      notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
      `

      // Stiluri pentru butonul de închidere
      const closeBtn = notification.querySelector('.notification-close') as HTMLElement
      closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
      `

      // Event listener pe butonul de închidere
      closeBtn.addEventListener('click', () => notification.remove())
      // Adăugăm notificarea în pagină
      document.body.appendChild(notification)

      // Auto-eliminare după 5 secunde
      setTimeout(() => {
        if (notification.parentNode) notification.remove()
      }, 5000)
    }

    // === Cleanup (Curățare) ===
    // Această funcție se apelează când componenta se dezactivează sau re-randează
    // Eliminăm TOATE ascultătorii de evenimente pentru a preveni "memory leaks" (scurgeri de memorie)
    return () => {
      hamburger?.removeEventListener('click', toggleMobileMenu)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('keydown', handleKeyDown)
      if (contactForm) contactForm.removeEventListener('submit', handleFormSubmit)
      revealObserver.disconnect()
    }
  }, [selectedCategory, openAboutModal, categories, packages])

  // =============================================
  // AFIȘAREA PAGINII (JSX)
  // Tot ce este mai jos este structura vizuală a paginii
  // JSX = o sintaxă specială care arată ca HTML dar este JavaScript
  // =============================================
  return (
    // Fragment (<> </>) = container invizibil care grupează mai multe elemente
    <>

      {/* =============================================
          SECȚIUNEA PRELOADER
          Animația de încărcare care apare la prima vizită pe site
          Se ascunde după 2.2 secunde (când preloaderDone devine true)
          Clasa 'loaded' activează animația de dispariție din CSS
          ============================================= */}
      <div className={`preloader ${preloaderDone ? 'loaded' : ''}`}>
        <div className="preloader-logo">BC</div>
        <div className="preloader-line"></div>
        <div className="preloader-tagline">Photography</div>
      </div>

      {/* =============================================
          SECȚIUNEA NAVBAR (Bara de Navigare)
          Meniul fix de sus care rămâne vizibil la scroll
          Conține: logo, link-uri de navigare, icoane sociale, hamburger (mobil)
          ============================================= */}
      <nav className="navbar" id="navbar">
        <div className="nav-container">
          {/* Logo-ul site-ului (inițialele BC + textul "Banciu Costin Photography") */}
          <div className="nav-logo">
            <div className="logo-mark">
              <span className="logo-initials">BC</span>
              <div className="logo-line"></div>
            </div>
            <div className="logo-text">
              <h2>Banciu Costin</h2>
              <p>PHOTOGRAPHY</p>
            </div>
          </div>

          {/* Link-urile de navigare (meniu) */}
          {/* Fiecare link are href cu #id-secțiune pentru scroll smooth */}
          <ul className="nav-menu" id="nav-menu">
            <li><a href="#home" className="nav-link">Acasă</a></li>
            <li><a href="#servicii" className="nav-link">Servicii</a></li>
            <li><a href="#portofoliu" className="nav-link">Portofoliu</a></li>
            <li><a href="#despre" className="nav-link">Despre</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>

          {/* Iconițele sociale (telefon, Facebook, Instagram) */}
          <div className="social-icons">
            <a href="tel:+40753110407" className="social-link">
              <i className="fas fa-phone"></i>
            </a>
            <a href="https://www.facebook.com/CostinBanciuPhotography" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
          </div>

          {/* Butonul hamburger (3 linii) - vizibil doar pe mobil */}
          {/* Cele 3 <span> reprezintă cele 3 linii orizontale */}
          <div className="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* =============================================
          SECȚIUNEA HERO SLIDER
          Aceasta este prima secțiune pe care o vede utilizatorul
          Conține un slideshow cu imagini care se schimbă automat la 3 secunde
          onMouseEnter = pauză slider la hover
          onMouseLeave = repornire slider când mouse-ul pleacă
          ============================================= */}
      <section
        id="home"
        className="hero-slider"
        onMouseEnter={() => setSliderPaused(true)}
        onMouseLeave={() => setSliderPaused(false)}
      >
        {/* Parcurgem toate slide-urile și le afișăm */}
        {/* Doar slide-ul activ are clasa 'hero-slide-active' (vizibil) */}
        {allSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === activeSlide ? 'hero-slide-active' : ''}`}
          >
            {/* Imaginea slide-ului */}
            {/* fill = umple containerul, sizes = hint pentru browser */}
            {/* quality={90} = calitatea imaginii (90%) */}
            {/* priority = slide-ul 0 se încarcă imediat (nu lazy) */}
            <Image
              src={slide.url}
              alt={slide.alt}
              fill
              sizes="100vw"
              quality={90}
              priority={index === 0}
              className="hero-slide-image"
            />
            {/* Overlay = strat semi-transparent negru peste imagine */}
            <div className="hero-slide-overlay"></div>
          </div>
        ))}

        {/* Text overlay - apare DOAR pe slide-ul hero (primul, index 0) */}
        {/* Efect parallax: textul se deplasează vertical la scroll */}
        {/* style transform translateY = mută textul pe verticală */}
        <div
          className={`hero-text-overlay ${activeSlide === 0 ? 'hero-text-visible' : ''}`}
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        >
          <h1>Banciu Costin</h1>
          <p className="hero-subtitle-text">F O T O G R A F</p>
          <p className="hero-tagline">Surprind momente, creez amintiri</p>
        </div>

        {/* Eticheta slide-ului - apare pe slide-urile portofoliu (nu pe primul) */}
        {/* Afișează numărul slide-ului și titlul categoriei */}
        {/* padStart(2, '0') = adaugă zero la numere cu o cifră (01, 02, etc.) */}
        {activeSlide > 0 && allSlides[activeSlide]?.title && (
          <div className="hero-slide-label">
            <span className="hero-slide-number">
              {String(activeSlide).padStart(2, '0')}
            </span>
            <span className="hero-slide-catname">
              {allSlides[activeSlide].title}
            </span>
          </div>
        )}

        {/* Indicatorii din dreapta (punctele/liniile) */}
        {/* Cel activ are clasa 'hero-indicator-active' */}
        {/* Math.min limiteaza la 10 indicatori maxim */}
        <div className="hero-indicators">
          {allSlides.slice(0, Math.min(allSlides.length, 10)).map((_, index) => (
            <button
              key={index}
              className={`hero-indicator ${index === activeSlide ? 'hero-indicator-active' : ''}`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>

        {/* Săgețile de navigare (stânga/dreapta) */}
        <button className="hero-nav hero-nav-prev" onClick={goToPrevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="hero-nav hero-nav-next" onClick={goToNextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>

        {/* Indicatorul de scroll (linia animată din josul ecranului) */}
        <div className="hero-scroll-hint">
          <div className="hero-scroll-line"></div>
        </div>
      </section>

      {/* =============================================
          SECȚIUNEA STATISTICI (Stats Band)
          Bandă cu 4 statistici care numără animat de la 0
          ref={statsRef} = referința folosită de IntersectionObserver
          Animația pornește când secțiunea devine vizibilă
          ============================================= */}
      <section className="stats-band" ref={statsRef}>
        <div className="stats-inner">
          {/* Fiecare stat-item are un număr animat și o etichetă */}
          {/* Clasa 'reveal' activează animația de apariție la scroll */}
          {/* 'reveal-delay-X' adaugă un delay (întârziere) pentru efect secvențial */}
          <div className="stat-item reveal">
            <span className="stat-number">{count1}</span>
            <span className="stat-label">Evenimente</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item reveal reveal-delay-1">
            <span className="stat-number">{count2}</span>
            <span className="stat-label">Ani Experiență</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item reveal reveal-delay-2">
            <span className="stat-number">{count3}</span>
            <span className="stat-label">Clienți Fericiți</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item reveal reveal-delay-3">
            <span className="stat-number">{count4}</span>
            <span className="stat-label">Fotografii Livrate</span>
          </div>
        </div>
      </section>

      {/* =============================================
          SECȚIUNEA VIDEO SHOWREEL
          Afișează un video de prezentare (YouTube/Vimeo)
          Se afișează DOAR dacă showreelVideo există (nu e null)
          {showreelVideo && (...)} = randare condiționată
          ============================================= */}
      {showreelVideo && (
        <section className="showreel-section">
          <div className="showreel-inner">
            {/* Header-ul secțiunii cu titlu și subtitlu */}
            <div className="showreel-header">
              <span className="showreel-label">Video</span>
              <h2 className="showreel-title">{showreelVideo.title}</h2>
              {/* Subtitlul se afișează doar dacă există */}
              {showreelVideo.subtitle && (
                <p className="showreel-subtitle">{showreelVideo.subtitle}</p>
              )}
            </div>

            {/* Player-ul video */}
            <div className="showreel-player">
              {/* Dacă videoul e în redare (showreelPlaying = true), afișăm iframe-ul */}
              {showreelPlaying ? (
                <div className="showreel-iframe-wrapper">
                  {/* iframe = încorporează un alt site (YouTube/Vimeo) în pagina noastră */}
                  {/* getEmbedUrl = transformă URL-ul video în URL de embed */}
                  <iframe
                    src={getEmbedUrl(showreelVideo.videoUrl)}
                    className="showreel-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                // Dacă videoul NU e în redare, afișăm thumbnail-ul cu buton Play
                <div
                  className="showreel-thumbnail"
                  onClick={() => setShowreelPlaying(true)}
                >
                  {/* eslint-disable-next-line = dezactivează avertismentul Next.js pentru <img> */}
                  {/* Thumbnail-ul: folosim imaginea personalizată sau cea de la YouTube */}
                  {(showreelVideo.thumbnailUrl || getYouTubeThumbnail(showreelVideo.videoUrl)) && (
                    <img
                      src={(showreelVideo.thumbnailUrl || getYouTubeThumbnail(showreelVideo.videoUrl))!}
                      alt={showreelVideo.title}
                      className="showreel-thumb-img"
                    />
                  )}
                  {/* Overlay cu butonul Play */}
                  <div className="showreel-play-overlay">
                    <div className="showreel-play-btn">
                      <i className="fas fa-play"></i>
                    </div>
                    <span className="showreel-play-text">Apasă pentru a viziona</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =============================================
          SECȚIUNEA GALERIE MOZAIC
          O grilă cu cele mai recente fotografii din portofoliu
          Afișează maxim 8 imagini într-un layout mozaic
          ============================================= */}
      <section className="mosaic-section">
        {/* Header-ul secțiunii */}
        <div className="mosaic-header reveal">
          <span className="mosaic-label">Portofoliu</span>
          <h2 className="mosaic-title">Momente care rămân</h2>
          <p className="mosaic-subtitle">O selecție din cele mai frumoase povești surprinse prin obiectiv</p>
        </div>

        {/* IIFE (Immediately Invoked Function Expression) */}
        {/* (() => { ... })() = funcție anonimă care se execută imediat */}
        {/* Folosită aici pentru a putea scrie logică JavaScript complexă în JSX */}
        {(() => {
          // Extragem primele 8 imagini din TOATE categoriile
          // flatMap = aplatizează arrays imbricate într-un singur array
          const mosaicImages = categories.flatMap(cat =>
            (cat.events || []).flatMap(event =>
              (event.images || []).map(img => ({
                url: img.url,
                alt: img.alt || cat.name,
                category: cat.name,
              }))
            )
          ).slice(0, 8)    // .slice(0, 8) = luăm doar primele 8

          // Dacă datele se încarcă, afișăm placeholders (scheletoane)
          if (loading) {
            return (
              <div className="mosaic-grid">
                {/* Creăm un array de 8 elemente și pentru fiecare afișăm un placeholder */}
                {/* 'shimmer' = clasa CSS care creează efect de strălucire */}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`mosaic-item mosaic-item-${i + 1} shimmer`} style={{ minHeight: '280px' }}></div>
                ))}
              </div>
            )
          }

          // Dacă avem imagini, le afișăm în grilă
          return mosaicImages.length > 0 ? (
            <div className="mosaic-grid">
              {mosaicImages.map((img, i) => (
                <div key={i} className={`mosaic-item mosaic-item-${i + 1} reveal`}>
                  {/* Imaginea din mozaic */}
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="mosaic-image"
                  />
                  {/* Overlay care apare la hover cu iconița de mărire și numele categoriei */}
                  <div className="mosaic-overlay">
                    <div className="mosaic-overlay-icon">
                      <i className="fas fa-expand"></i>
                    </div>
                    <span className="mosaic-cat">{img.category}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Dacă nu avem imagini, afișăm un mesaj
            <div className="mosaic-empty">
              <p>Galeria va fi disponibilă în curând</p>
            </div>
          )
        })()}

        {/* Butonul "Vezi tot portofoliul" - link către pagina /portofoliu */}
        <div className="mosaic-cta reveal">
          <Link href="/portofoliu" className="mosaic-btn">
            <span>Vezi tot portofoliul</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* =============================================
          SECȚIUNEA PACHETE SERVICII
          Afișează pachetele foto-video cu prețuri și detalii
          Se afișează DOAR dacă avem pachete (packages.length > 0)
          Are un sistem de tab-uri pentru a naviga între pachete
          ============================================= */}
      {packages.length > 0 && (
      <section id="servicii" className="packages-section">
        <div className="packages-inner">
          {/* Header-ul secțiunii */}
          <div className="packages-header reveal">
            <span className="packages-label">Servicii</span>
            <h2 className="packages-title">Pachete Foto-Video</h2>
            <p className="packages-subtitle">Alege pachetul potrivit pentru evenimentul tău</p>
          </div>

          {/* Tab-urile pachetelor - butoane pentru a selecta un pachet */}
          <div className="packages-tabs reveal">
            {packages.map((pkg, i) => (
              <button
                key={pkg.id}
                // Adăugăm clasa 'active' pe tab-ul selectat
                className={`packages-tab ${activePackage === i ? 'packages-tab-active' : ''}`}
                onClick={() => setActivePackage(i)}
              >
                <i className={pkg.icon}></i>
                <span>{pkg.name}</span>
              </button>
            ))}
          </div>

          {/* Cardul pachetului activ */}
          {/* Parcurgem toate pachetele, dar afișăm doar cel cu index-ul activ */}
          {packages.map((pkg, i) => {
            // Dacă acest pachet nu e cel activ, nu afișăm nimic
            if (activePackage !== i) return null
            // Extragem listele de features, extras și notes cu type casting
            // as {icon: string; text: string}[] = spunem TypeScript ce tip de date sunt
            const features = (pkg.features || []) as {icon: string; text: string}[]
            const extras = (pkg.extras || []) as {text: string; price: string}[]
            const notes = (pkg.notes || []) as {icon: string; text: string}[]
            return (
              <div key={pkg.id} className="package-card">
                {/* Header-ul cardului cu badge, nume, preț și tier */}
                <div className="package-card-header">
                  {/* Badge-ul (ex: "Popular", "Premium") - se afișează doar dacă există */}
                  {pkg.badge && <div className="package-badge">{pkg.badge}</div>}
                  <h3 className="package-name">{pkg.name}</h3>
                  {/* Prețul și moneda */}
                  <div className="package-price">
                    <span className="package-amount">{pkg.price}</span>
                    <span className="package-currency">{pkg.currency}</span>
                  </div>
                  {/* Tier-ul (ex: "Pachet Standard", "Pachet Premium") */}
                  <p className="package-tier">{pkg.tier}</p>
                </div>

                {/* Corpul cardului cu detalii */}
                <div className="package-card-body">
                  {/* Lista de funcționalități (features) incluse în pachet */}
                  <div className="package-features">
                    {features.map((f, fi) => (
                      <div key={fi} className="package-feature"><i className={f.icon}></i><span>{f.text}</span></div>
                    ))}
                  </div>

                  {/* Servicii extra (opționale, cu preț suplimentar) */}
                  {/* Se afișează doar dacă există extras */}
                  {extras.length > 0 && (
                    <div className="package-extras">
                      <h4 className="package-extras-title">Servicii Extra</h4>
                      {extras.map((ex, ei) => (
                        <div key={ei} className="package-extra-item"><span>{ex.text}</span><span className="package-extra-price">{ex.price}</span></div>
                      ))}
                    </div>
                  )}

                  {/* Note importante despre pachet */}
                  {notes.length > 0 && (
                    <div className="package-notes">
                      {notes.map((n, ni) => (
                        <p key={ni}><i className={n.icon}></i> {n.text}</p>
                      ))}
                    </div>
                  )}

                  {/* Butonul CTA (Call To Action) - "Solicită o ofertă" */}
                  {/* La click: scrolează lin la secțiunea de contact */}
                  <a href="#contact" className="package-cta" onClick={(e) => {
                    e.preventDefault()
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}>
                    <span>Solicită o ofertă</span>
                    <i className="fas fa-arrow-right"></i>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </section>
      )}

      {/* =============================================
          SECȚIUNEA CONTACT
          Conține carduri de contact (telefon, WhatsApp, email, locație)
          și un formular de contact
          ============================================= */}
      <section id="contact" className="ct">
        {/* Fundalul decorativ al secțiunii */}
        <div className="ct-bg">
          <div className="ct-bg-glow"></div>
          <div className="ct-bg-grid"></div>
        </div>

        <div className="ct-inner">
          {/* Header-ul secțiunii de contact */}
          <div className="ct-header reveal">
            <span className="ct-label">Contact</span>
            <h2 className="ct-title">Hai să vorbim</h2>
            <p className="ct-subtitle">Fiecare poveste merită să fie spusă frumos. Spune-mi povestea ta.</p>
          </div>

          <div className="ct-layout">
            {/* =============================================
                CARDURILE DE CONTACT (stânga)
                Link-uri către telefon, WhatsApp, email
                ============================================= */}
            <div className="ct-cards">
              {/* Card Telefon - href="tel:" deschide aplicația de apeluri */}
              <a href="tel:+40753110407" className="ct-card reveal">
                <div className="ct-card-icon ct-card-icon-phone">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="ct-card-text">
                  <span className="ct-card-label">Telefon</span>
                  <span className="ct-card-value">+40 753 110 407</span>
                </div>
                <i className="fas fa-arrow-right ct-card-arrow"></i>
              </a>

              {/* Card WhatsApp - deschide conversație WhatsApp */}
              <a href="https://wa.me/40753110407" target="_blank" rel="noopener noreferrer" className="ct-card reveal reveal-delay-1">
                <div className="ct-card-icon ct-card-icon-whatsapp">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div className="ct-card-text">
                  <span className="ct-card-label">WhatsApp</span>
                  <span className="ct-card-value">Scrie-mi direct</span>
                </div>
                <i className="fas fa-arrow-right ct-card-arrow"></i>
              </a>

              {/* Card Email - href="mailto:" deschide aplicația de email */}
              <a href="mailto:costinfoto@gmail.com" className="ct-card reveal reveal-delay-2">
                <div className="ct-card-icon ct-card-icon-email">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="ct-card-text">
                  <span className="ct-card-label">Email</span>
                  <span className="ct-card-value">costinfoto@gmail.com</span>
                </div>
                <i className="fas fa-arrow-right ct-card-arrow"></i>
              </a>

              {/* Card Locație - doar informativ, fără link */}
              <div className="ct-card ct-card-location reveal reveal-delay-3">
                <div className="ct-card-icon ct-card-icon-location">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="ct-card-text">
                  <span className="ct-card-label">Locație</span>
                  <span className="ct-card-value">Constanța, România</span>
                </div>
              </div>

              {/* Iconițe sociale (Facebook, Instagram, WhatsApp) */}
              <div className="ct-socials reveal reveal-delay-4">
                <a href="https://www.facebook.com/CostinBanciuPhotography" target="_blank" rel="noopener noreferrer" className="ct-social">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="ct-social">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://wa.me/40753110407" target="_blank" rel="noopener noreferrer" className="ct-social">
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>

            {/* =============================================
                FORMULARUL DE CONTACT (dreapta)
                Câmpuri: Nume, Email, Telefon, Serviciu (dropdown), Mesaj
                La submit se trimite prin API către server
                ============================================= */}
            <div className="ct-form-wrap reveal">
              <div className="ct-form-header">
                <h3>Trimite un mesaj</h3>
                <p>Completează formularul și voi reveni cu un răspuns cât mai curând</p>
              </div>
              {/* Formularul HTML - id="contact-form" este folosit de JavaScript pentru submit */}
              <form id="contact-form" className="ct-form">
                {/* Rândul 1: Nume + Email */}
                <div className="ct-form-row">
                  <div className="ct-field">
                    <label>Nume *</label>
                    {/* required = câmpul este obligatoriu */}
                    <input type="text" name="name" placeholder="Numele tău complet" required />
                  </div>
                  <div className="ct-field">
                    <label>Email *</label>
                    <input type="email" name="email" placeholder="email@exemplu.com" required />
                  </div>
                </div>
                {/* Rândul 2: Telefon + Serviciu (dropdown) */}
                <div className="ct-form-row">
                  <div className="ct-field">
                    <label>Telefon *</label>
                    <input type="tel" name="phone" placeholder="+40 7XX XXX XXX" required />
                  </div>
                  <div className="ct-field">
                    <label>Serviciu *</label>
                    {/* select = dropdown (meniu derulant) */}
                    {/* Opțiunile sunt generate dinamic din categoriile încărcate */}
                    <select name="service" required>
                      <option value="">Alege tipul evenimentului</option>
                      {/* .map() = parcurgem fiecare categorie și creăm o opțiune */}
                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Câmpul Mesaj */}
                <div className="ct-field">
                  <label>Mesaj</label>
                  {/* textarea = câmp de text cu mai multe rânduri */}
                  {/* rows={5} = 5 rânduri vizibile inițial */}
                  <textarea name="message" placeholder="Povestește-mi despre evenimentul tău - dată, locație, ce îți dorești..." rows={5}></textarea>
                </div>
                {/* Butonul de trimitere */}
                <button type="submit" className="ct-submit">
                  <span>Trimite mesajul</span>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =============================================
          MODALUL DE CATEGORIE (CategoryViewModal)
          Se afișează când selectedCategory nu este null
          Arată evenimentele din categoria selectată
          ============================================= */}
      {selectedCategory && (
        <CategoryViewModal
          category={selectedCategory}
          onClose={closeModal}
        />
      )}

      {/* =============================================
          MODALUL "DESPRE MINE" (AboutModal)
          Se afișează când isAboutModalOpen este true
          Arată informații despre fotograf
          ============================================= */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={closeAboutModal}
      />

      {/* =============================================
          SECȚIUNEA FOOTER (Subsolul paginii)
          Conține: logo, link-uri sociale, link-uri de navigare, copyright
          ============================================= */}
      <footer className="ft">
        <div className="ft-inner">
          {/* Logo-ul și tagline-ul din footer */}
          <div className="ft-brand reveal">
            <div className="ft-logo">
              <span className="ft-initials">BC</span>
              <div className="ft-logo-line"></div>
            </div>
            <p className="ft-tagline">Surprind momente, creez amintiri</p>
          </div>

          {/* Iconițe sociale din footer */}
          <div className="ft-socials reveal">
            <a href="https://www.facebook.com/CostinBanciuPhotography" target="_blank" rel="noopener noreferrer" className="ft-social-link">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="ft-social-link">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://wa.me/40753110407" target="_blank" rel="noopener noreferrer" className="ft-social-link">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="tel:+40753110407" className="ft-social-link">
              <i className="fas fa-phone"></i>
            </a>
          </div>

          {/* Linia despărțitoare */}
          <div className="ft-divider"></div>

          {/* Link-uri de navigare rapide din footer */}
          <div className="ft-links reveal">
            <a href="#home">Acasă</a>
            {/* onClick pe "Portofoliu" navighează la pagina /portofoliu */}
            <a href="#portofoliu" onClick={() => { window.location.href = '/portofoliu' }}>Portofoliu</a>
            {/* onClick pe "Despre" deschide modalul AboutModal */}
            <a href="#despre" onClick={(e) => { e.preventDefault(); openAboutModal() }}>Despre</a>
            <a href="#contact">Contact</a>
          </div>

          {/* Copyright - new Date().getFullYear() = anul curent dinamic */}
          <div className="ft-copy">
            <p>&copy; {new Date().getFullYear()} Banciu Costin Photography</p>
            <p className="ft-copy-sub">Toate drepturile rezervate</p>
          </div>
        </div>
      </footer>
    </>
  )
}
