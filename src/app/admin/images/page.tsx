// 'use client' spune lui Next.js că acest fișier rulează în browser
'use client'

// Importăm tipurile de date definite în proiect
// Category = structura unei categorii, Event = structura unui eveniment, Image = structura unei imagini
import { Category, Event, Image } from '@/types'
// NextImage = componenta Next.js optimizată pentru afișarea imaginilor (încărcare rapidă, resize automat)
import NextImage from 'next/image'
// Link = componenta Next.js pentru navigare între pagini
import Link from 'next/link'
// useEffect = rulează cod la încărcarea componentei
// useState = stochează date care se pot schimba
import { useEffect, useState } from 'react'

// =============================================================================
// Tipul ImageWithEvent - extinde tipul Image cu informații despre eveniment
// Fiecare imagine aparține unui eveniment, care aparține unei categorii
// =============================================================================
interface ImageWithEvent extends Image {
  event: Event & {           // Evenimentul la care aparține imaginea
    category: Category       // Categoria evenimentului
  }
}

// =============================================================================
// AllImagesPage - Pagina care afișează TOATE imaginile din toate evenimentele
// Permite filtrarea pe categorii și ștergerea imaginilor
// =============================================================================
export default function AllImagesPage() {
  // Stocăm lista de imagini primite de la server (fiecare cu evenimentul și categoria sa)
  const [images, setImages] = useState<ImageWithEvent[]>([])
  // Indică dacă datele se încarcă de la server (true = se încarcă)
  const [loading, setLoading] = useState(true)
  // Stocăm mesajul de eroare (gol = nicio eroare)
  const [error, setError] = useState('')
  // Stocăm categoria selectată pentru filtrare ('all' = toate categoriile)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  // Stocăm lista de categorii disponibile (pentru butoanele de filtrare)
  const [categories, setCategories] = useState<Category[]>([])

  // ==========================================================================
  // fetchData - Funcția care preia datele de la server
  // Încarcă simultan atât imaginile cât și categoriile (Promise.all)
  // ==========================================================================
  const fetchData = async () => {
    try {
      // Promise.all trimite ambele cereri în paralel (simultan, nu una după alta)
      // Acest lucru face pagina mai rapidă decât dacă le-am trimite pe rând
      const [imagesRes, categoriesRes] = await Promise.all([
        // Cerere GET pentru a primi toate imaginile
        fetch('/api/admin/images'),
        // Cerere GET pentru a primi toate categoriile
        fetch('/api/admin/categories')
      ])
      // Verificăm dacă ambele răspunsuri sunt OK (status 200)
      if (!imagesRes.ok || !categoriesRes.ok) throw new Error('Eroare la încărcarea datelor')
      // Convertim ambele răspunsuri din JSON în obiecte JavaScript
      const [imagesData, categoriesData] = await Promise.all([imagesRes.json(), categoriesRes.json()])
      // Salvăm datele în state
      setImages(imagesData)
      setCategories(categoriesData)
    } catch (err) {
      // Dacă a apărut o eroare, o salvăm pentru a o afișa utilizatorului
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      // Oprim starea de încărcare (indiferent de succes sau eroare)
      setLoading(false)
    }
  }

  // useEffect apelează fetchData o singură dată, la încărcarea paginii
  // [] = array gol de dependențe = rulează doar la montarea componentei
  useEffect(() => { fetchData() }, [])

  // ==========================================================================
  // handleDelete - Funcția care șterge o imagine
  // imageId = ID-ul imaginii de șters
  // fileName = numele fișierului (afișat în mesajul de confirmare)
  // ==========================================================================
  const handleDelete = async (imageId: string, fileName: string) => {
    // Afișăm o fereastră de confirmare - dacă utilizatorul apasă Cancel, oprim
    if (!confirm(`Ești sigur că vrei să ștergi imaginea "${fileName}"?`)) return
    try {
      // Trimitem cererea DELETE la server pentru imaginea cu ID-ul specificat
      const response = await fetch(`/api/admin/images/${imageId}`, { method: 'DELETE' })
      if (!response.ok) {
        // Dacă serverul a returnat o eroare, o citim și o aruncăm (throw)
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la ștergerea imaginii')
      }
      // Eliminăm imaginea din lista locală (fără a reîncărca de la server)
      // .filter() creează un array nou fără imaginea cu ID-ul șters
      setImages(images.filter(img => img.id !== imageId))
    } catch (err) {
      // Afișăm eroarea într-un alert
      alert(err instanceof Error ? err.message : 'Eroare la ștergerea imaginii')
    }
  }

  // Filtrăm imaginile în funcție de categoria selectată
  // Dacă e 'all', afișăm toate imaginile; altfel, doar cele din categoria selectată
  const filteredImages = selectedCategory === 'all' ? images : images.filter(image => image.event?.category?.id === selectedCategory)

  // ==========================================================================
  // Ecranul de încărcare - afișat cât timp se preiau datele de la server
  // ==========================================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        {/* Cerc animat de încărcare (spinner) */}
        <div className="w-10 h-10 border-2 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin"></div>
      </div>
    )
  }

  // ==========================================================================
  // Randarea paginii cu toate imaginile
  // ==========================================================================
  return (
    <div>
      {/* Header-ul paginii - titlu și descriere */}
      <div className="flex items-center justify-between mb-6">
        <div>
          {/* Titlul paginii */}
          <h1 className="text-2xl font-light text-white" style={{fontFamily: "'Playfair Display', serif"}}>Imagini</h1>
          {/* Subtitlul */}
          <p className="text-white/40 text-sm mt-1">Toate imaginile din evenimente</p>
        </div>
      </div>

      {/* Secțiunea de filtrare pe categorii */}
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Butonul "Toate" - afișează toate imaginile */}
          {/* Stilul se schimbă dacă este selectat (auriu) sau nu (gri) */}
          <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategory === 'all' ? 'bg-[#fbbf24] text-[#0a0a0a] font-medium' : 'bg-[#111111] text-white/50 border border-white/[0.06] hover:text-white/80'}`}>
            Toate ({images.length})
          </button>
          {/* Un buton pentru fiecare categorie */}
          {/* .map() creează câte un buton pentru fiecare categorie din array */}
          {categories.map((category) => (
            <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategory === category.id ? 'bg-[#fbbf24] text-[#0a0a0a] font-medium' : 'bg-[#111111] text-white/50 border border-white/[0.06] hover:text-white/80'}`}>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mesajul de eroare - se afișează doar dacă variabila error NU este goală */}
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {/* Rândul de statistici - 3 carduri cu informații numerice */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Card: Total imagini */}
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] px-4 py-3">
          <p className="text-xs text-white/30 mb-0.5">Total</p>
          <p className="text-xl font-light text-white">{images.length}</p>
        </div>
        {/* Card: Imagini filtrate (câte se afișează acum) */}
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] px-4 py-3">
          <p className="text-xs text-white/30 mb-0.5">Filtrate</p>
          <p className="text-xl font-light text-white">{filteredImages.length}</p>
        </div>
        {/* Card: Număr total de evenimente distincte */}
        {/* new Set() elimină duplicatele - ne dă câte evenimente unice avem */}
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] px-4 py-3">
          <p className="text-xs text-white/30 mb-0.5">Evenimente</p>
          <p className="text-xl font-light text-white">{new Set(images.map(img => img.eventId)).size}</p>
        </div>
      </div>

      {/* Grila de imagini */}
      {/* Dacă nu există imagini filtrate, afișăm un mesaj */}
      {filteredImages.length === 0 ? (
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] px-5 py-16 text-center">
          {/* Iconița de imagini goale */}
          <i className="fas fa-images text-white/10 text-4xl mb-3"></i>
          {/* Mesaj diferit dacă e "Toate" sau o categorie specifică */}
          {selectedCategory === 'all' ? (
            <p className="text-white/30 text-sm">Nu există imagini încă</p>
          ) : (() => {
            // Găsim categoria selectată pentru a-i afișa numele
            const selectedCat = categories.find(c => c.id === selectedCategory)
            const catEvents = images.filter(img => img.event?.category?.id === selectedCategory)
            const hasEvents = (selectedCat as Category & { events?: Event[] })?.events?.length || catEvents.length > 0
            return (
              <>
                <p className="text-white/30 text-sm mb-4">Nu există imagini pentru <span className="text-white/60">{selectedCat?.name}</span></p>
                {/* Butoane de acțiune: creează eveniment sau vezi evenimente */}
                <div className="flex items-center justify-center gap-3">
                  {/* Buton pentru a crea un eveniment nou în această categorie */}
                  <Link
                    href={`/admin/events/new?categoryId=${selectedCategory}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#fbbf24] text-[#0a0a0a] rounded-lg text-sm font-medium hover:bg-[#f59e0b] transition-colors"
                  >
                    <i className="fas fa-plus text-xs"></i>
                    Creează eveniment
                  </Link>
                  {/* Buton pentru a vedea lista de evenimente */}
                  <Link
                    href="/admin/events"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-white/50 rounded-lg text-sm hover:text-white/80 hover:bg-white/10 transition-colors border border-white/[0.06]"
                  >
                    <i className="fas fa-list text-xs"></i>
                    Vezi evenimente
                  </Link>
                </div>
              </>
            )
          })()}
        </div>
      ) : (
        // Grila de imagini - 2 coloane pe mobil, 3 pe tableta, 4 pe desktop
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Iterăm prin fiecare imagine filtrată și creăm un card */}
          {filteredImages.map((image) => (
            // Card-ul imaginii - cu hover effect (bordura devine mai vizibilă)
            <div key={image.id} className="group bg-[#111111] rounded-xl border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all">
              {/* Container-ul imaginii - proporție 4:3 */}
              <div className="aspect-[4/3] relative bg-black/50">
                {/* Componenta NextImage optimizează automat imaginea (lazy loading, resize) */}
                {/* thumbnailUrl = versiunea mică a imaginii (pentru încărcare rapidă) */}
                <NextImage
                  src={image.thumbnailUrl || image.url}
                  alt={image.alt || image.filename}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              {/* Informațiile sub imagine */}
              <div className="p-3">
                {/* Badge-ul categoriei */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#fbbf24]/10 text-[#fbbf24]">
                    {image.event?.category?.name}
                  </span>
                </div>
                {/* Numele evenimentului */}
                <p className="text-xs text-white/70 mb-0.5 truncate">{image.event?.name}</p>
                {/* Numele fișierului imaginii */}
                <p className="text-[10px] text-white/30 truncate mb-2">{image.filename}</p>
                {/* Butoanele de acțiune: editare și ștergere */}
                <div className="flex items-center justify-between">
                  {/* Link către pagina de editare a imaginilor evenimentului */}
                  <Link href={`/admin/events/${image.eventId}/images`} className="text-white/30 hover:text-[#fbbf24] transition-colors">
                    <i className="fas fa-pen text-[10px]"></i>
                  </Link>
                  {/* Buton de ștergere a imaginii */}
                  <button onClick={() => handleDelete(image.id, image.filename)} className="text-white/30 hover:text-red-400 transition-colors">
                    <i className="fas fa-trash text-[10px]"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
