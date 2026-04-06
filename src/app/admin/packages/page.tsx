// 'use client' spune lui Next.js că acest fișier rulează în browser
'use client'

// useEffect = rulează cod când componenta se încarcă
// useState = stochează date care se pot schimba
// useCallback = memorează o funcție pentru a nu o recrea la fiecare randare
import { useEffect, useState, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Tipuri (Types) - definim structura datelor folosite în pagină
// Tipurile ne ajută să știm exact ce proprietăți are fiecare obiect
// ---------------------------------------------------------------------------

// Structura unei funcționalități/serviciu inclus în pachet
// Exemplu: { icon: 'fas fa-check', text: 'Ședință foto 2 ore' }
interface PackageFeature {
  icon: string   // Clasa CSS pentru iconița Font Awesome
  text: string   // Textul descrierii serviciului
}

// Structura unui serviciu extra (opțional, cu preț suplimentar)
// Exemplu: { text: 'Album foto suplimentar', price: '+100 Euro' }
interface PackageExtra {
  text: string   // Descrierea extra-ului
  price: string  // Prețul suplimentar
}

// Structura unei note informative
// Exemplu: { icon: 'fas fa-info-circle', text: 'Deplasare inclusă' }
interface PackageNote {
  icon: string   // Iconița notei
  text: string   // Textul notei
}

// Structura completă a unui pachet de servicii
// Aceasta definește TOATE câmpurile pe care le are un pachet în baza de date
interface ServicePackage {
  id: string                  // Identificatorul unic al pachetului
  name: string                // Numele pachetului (ex: "Pachet Nuntă Premium")
  icon: string                // Iconița pachetului (Font Awesome)
  price: number               // Prețul pachetului (număr)
  currency: string            // Moneda (ex: "Euro", "Lei")
  tier: string                // Nivelul/categoria pachetului (ex: "Pachet Basic")
  badge: string | null        // Etichetă opțională (ex: "Popular") - null dacă nu există
  isActive: boolean           // Dacă pachetul e activ (vizibil pe site)
  features: PackageFeature[]  // Lista de servicii incluse
  extras: PackageExtra[]      // Lista de servicii extra
  notes: PackageNote[]        // Lista de note
  createdAt?: string          // Data creării (opțional - ? înseamnă că poate lipsi)
  updatedAt?: string          // Data ultimei actualizări (opțional)
}

// ---------------------------------------------------------------------------
// Funcție helper care creează un formular gol (pentru pachete noi)
// Omit<> exclude câmpurile 'id', 'createdAt', 'updatedAt' din tip
// (acestea sunt generate automat de server)
// ---------------------------------------------------------------------------
const blankForm = (): Omit<ServicePackage, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '',                                          // Numele gol
  icon: 'fas fa-camera',                              // Iconița implicită
  price: 0,                                           // Prețul inițial 0
  currency: 'Euro',                                   // Moneda implicită
  tier: 'Pachet Basic',                               // Nivelul implicit
  badge: null,                                        // Fără etichetă
  isActive: true,                                     // Activ implicit
  features: [{ icon: 'fas fa-check', text: '' }],     // Un serviciu gol implicit
  extras: [],                                         // Fără extra-uri
  notes: [],                                          // Fără note
})

// ---------------------------------------------------------------------------
// Componenta principală a paginii de pachete
// ---------------------------------------------------------------------------

// =============================================================================
// PackagesPage - Pagina de administrare a pachetelor de servicii
// Permite: vizualizarea, crearea, editarea, ștergerea și activarea/dezactivarea pachetelor
// =============================================================================
export default function PackagesPage() {
  // Stocăm lista de pachete primite de la server
  const [packages, setPackages] = useState<ServicePackage[]>([])
  // Indică dacă datele se încarcă de la server (true = se încarcă, false = gata)
  const [loading, setLoading] = useState(true)
  // Indică dacă se salvează un pachet (true = se salvează)
  const [saving, setSaving] = useState(false)

  // Stocăm ID-ul pachetului care se editează:
  // null = nu edităm nimic, 'new' = creăm pachet nou, 'abc123' = edităm pachetul cu acel ID
  const [editingId, setEditingId] = useState<string | null>(null)

  // Stocăm datele din formularul de creare/editare
  // form conține toate câmpurile pachetului (fără id)
  const [form, setForm] = useState(blankForm())

  // -----------------------------------------------------------------------
  // Funcția de preluare a pachetelor de la server (Fetch)
  // useCallback memorează funcția pentru a nu o recrea la fiecare randare
  // -----------------------------------------------------------------------
  const fetchPackages = useCallback(async () => {
    try {
      // Trimitem o cerere GET la server pentru a primi toate pachetele
      // fetch() este funcția care face cereri HTTP (ca un browser care accesează o adresă)
      const res = await fetch('/api/admin/packages')
      // Verificăm dacă răspunsul e OK (status 200)
      if (res.ok) {
        // Convertim răspunsul din format JSON în obiect JavaScript
        const data = await res.json()
        // Salvăm pachetele primite în state
        setPackages(data)
      }
    } catch (err) {
      // Dacă a apărut o eroare (ex: server indisponibil), o afișăm în consolă
      console.error('Error fetching packages:', err)
    } finally {
      // finally se execută ÎNTOTDEAUNA - oprim starea de încărcare
      setLoading(false)
    }
  }, [])

  // useEffect apelează fetchPackages când componenta se încarcă prima dată
  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  // -----------------------------------------------------------------------
  // Funcții helper pentru gestionarea formularului
  // -----------------------------------------------------------------------

  // Resetează formularul la starea inițială (închide editarea)
  const resetForm = () => {
    setEditingId(null)       // Nu mai edităm nimic
    setForm(blankForm())     // Golim formularul
  }

  // Deschide formularul pentru crearea unui pachet nou
  const openCreate = () => {
    setEditingId('new')      // Setăm modul "creare nouă"
    setForm(blankForm())     // Pornim cu un formular gol
  }

  // Deschide formularul pentru editarea unui pachet existent
  // pkg = pachetul pe care vrem să-l edităm
  const openEdit = (pkg: ServicePackage) => {
    setEditingId(pkg.id)     // Setăm ID-ul pachetului editat
    // Populăm formularul cu datele pachetului existent
    setForm({
      name: pkg.name,
      icon: pkg.icon,
      price: pkg.price,
      currency: pkg.currency,
      tier: pkg.tier,
      badge: pkg.badge,
      isActive: pkg.isActive,
      // Dacă pachetul are servicii, le folosim; dacă nu, punem un rând gol
      features: pkg.features.length > 0 ? pkg.features : [{ icon: 'fas fa-check', text: '' }],
      extras: pkg.extras.length > 0 ? pkg.extras : [],
      notes: pkg.notes.length > 0 ? pkg.notes : [],
    })
  }

  // -----------------------------------------------------------------------
  // Operațiuni CRUD (Create, Read, Update, Delete)
  // Acestea sunt operațiunile de bază pentru gestionarea datelor
  // -----------------------------------------------------------------------

  // Salvează pachetul (fie creare, fie actualizare)
  const handleSave = async () => {
    // Validare: verificăm dacă numele este completat
    if (!form.name.trim()) {
      alert('Introdu un nume pentru pachet')
      return   // Oprim execuția funcției
    }
    // Validare: verificăm dacă prețul este mai mare ca 0
    if (form.price <= 0) {
      alert('Prețul trebuie să fie mai mare decât 0')
      return
    }

    // Activăm starea de salvare (afișăm spinner pe buton)
    setSaving(true)

    try {
      // Pregătim datele pentru trimitere la server
      const body = {
        ...form,                                          // Copiem toate câmpurile formularului
        badge: form.badge?.trim() || null,                // Dacă badge-ul e gol, trimitem null
        features: form.features.filter(f => f.text.trim()),  // Eliminăm serviciile cu text gol
        extras: form.extras.filter(e => e.text.trim()),      // Eliminăm extra-urile goale
        notes: form.notes.filter(n => n.text.trim()),        // Eliminăm notele goale
      }

      // Verificăm dacă creăm un pachet NOU sau actualizăm unul existent
      const isNew = editingId === 'new'

      // Trimitem cererea la server
      // POST = creare nouă, PUT = actualizare
      const res = isNew
        ? await fetch('/api/admin/packages', {
            method: 'POST',                                    // Metodă HTTP pentru creare
            headers: { 'Content-Type': 'application/json' },   // Spunem serverului că trimitem JSON
            body: JSON.stringify(body),                         // Convertim obiectul în text JSON
          })
        : await fetch(`/api/admin/packages/${editingId}`, {
            method: 'PUT',                                     // Metodă HTTP pentru actualizare
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })

      // Dacă serverul a răspuns cu succes
      if (res.ok) {
        resetForm()              // Închidem formularul
        await fetchPackages()    // Reîncărcăm lista de pachete
      } else {
        // Dacă a fost o eroare, o afișăm
        const err = await res.json()
        alert(err.error || 'Eroare la salvare')
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('Eroare la salvare')
    } finally {
      // Dezactivăm starea de salvare
      setSaving(false)
    }
  }

  // Șterge un pachet după ID
  const handleDelete = async (id: string) => {
    // Afișăm o fereastră de confirmare - dacă utilizatorul apasă "Cancel", oprim
    if (!confirm('Sigur vrei să ștergi acest pachet? Acțiunea este ireversibilă.')) return

    try {
      // Trimitem cererea DELETE la server
      const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' })
      if (res.ok) {
        // Eliminăm pachetul din lista locală (fără a reîncărca de la server)
        // .filter() creează un array nou fără pachetul cu ID-ul șters
        setPackages(packages.filter(p => p.id !== id))
        // Dacă editam pachetul șters, închidem formularul
        if (editingId === id) resetForm()
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  // Activează/Dezactivează un pachet (toggle = comutare)
  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      // Trimitem cererea PUT cu valoarea opusă a isActive
      // Dacă era activ (true), trimitem false, și invers
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      if (res.ok) {
        // Actualizăm starea locală - .map() parcurge fiecare pachet
        // și schimbă isActive doar pentru pachetul cu ID-ul potrivit
        setPackages(packages.map(p => (p.id === id ? { ...p, isActive: !isActive } : p)))
      }
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  // -----------------------------------------------------------------------
  // Funcții helper pentru listele dinamice din formular
  // Permit adăugarea, ștergerea și actualizarea elementelor din liste
  // -----------------------------------------------------------------------

  // --- Funcții pentru servicii incluse (features) ---
  // Adaugă un serviciu nou (gol) la lista de features
  const addFeature = () =>
    setForm(f => ({ ...f, features: [...f.features, { icon: 'fas fa-check', text: '' }] }))
  // Șterge serviciul de la poziția i din listă
  const removeFeature = (i: number) =>
    setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }))
  // Actualizează un câmp (icon sau text) al serviciului de la poziția i
  const updateFeature = (i: number, field: keyof PackageFeature, value: string) =>
    setForm(f => ({
      ...f,
      features: f.features.map((feat, idx) => (idx === i ? { ...feat, [field]: value } : feat)),
    }))

  // --- Funcții pentru servicii extra ---
  // Adaugă un extra nou (gol) la listă
  const addExtra = () =>
    setForm(f => ({ ...f, extras: [...f.extras, { text: '', price: '' }] }))
  // Șterge extra-ul de la poziția i
  const removeExtra = (i: number) =>
    setForm(f => ({ ...f, extras: f.extras.filter((_, idx) => idx !== i) }))
  // Actualizează un câmp (text sau price) al extra-ului de la poziția i
  const updateExtra = (i: number, field: keyof PackageExtra, value: string) =>
    setForm(f => ({
      ...f,
      extras: f.extras.map((ext, idx) => (idx === i ? { ...ext, [field]: value } : ext)),
    }))

  // --- Funcții pentru note ---
  // Adaugă o notă nouă (goală) la listă
  const addNote = () =>
    setForm(f => ({ ...f, notes: [...f.notes, { icon: 'fas fa-info-circle', text: '' }] }))
  // Șterge nota de la poziția i
  const removeNote = (i: number) =>
    setForm(f => ({ ...f, notes: f.notes.filter((_, idx) => idx !== i) }))
  // Actualizează un câmp (icon sau text) al notei de la poziția i
  const updateNote = (i: number, field: keyof PackageNote, value: string) =>
    setForm(f => ({
      ...f,
      notes: f.notes.map((note, idx) => (idx === i ? { ...note, [field]: value } : note)),
    }))

  // -----------------------------------------------------------------------
  // Calculăm numărul de pachete active
  // .filter() selectează doar pachetele unde isActive === true
  // .length = câte elemente are array-ul filtrat
  // -----------------------------------------------------------------------
  const activeCount = packages.filter(p => p.isActive).length

  // -----------------------------------------------------------------------
  // Dacă datele se încarcă, afișăm un spinner
  // -----------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        {/* Cerc animat de încărcare */}
        <div className="w-10 h-10 border-2 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin"></div>
      </div>
    )
  }

  // -----------------------------------------------------------------------
  // Clase CSS reutilizabile pentru input-uri
  // Le definim o singură dată și le folosim peste tot în formular
  // -----------------------------------------------------------------------

  // Stilul standard pentru câmpurile de input
  const inputCls =
    'w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#fbbf24]/40 focus:ring-1 focus:ring-[#fbbf24]/20 transition-colors'
  // Stilul pentru etichete (labels)
  const labelCls = 'block text-sm font-medium text-white/60 mb-1.5'
  // Stilul pentru input-uri mai mici (în liste)
  const smallInputCls =
    'px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#fbbf24]/40 focus:ring-1 focus:ring-[#fbbf24]/20 transition-colors'

  // -----------------------------------------------------------------------
  // Randarea paginii
  // -----------------------------------------------------------------------

  return (
    <div>
      {/* ================================================================= */}
      {/* Header-ul paginii - titlu, statistici și butonul de adăugare */}
      {/* ================================================================= */}
      <div className="flex items-center justify-between mb-8">
        <div>
          {/* Titlul paginii */}
          <h1
            className="text-2xl font-light text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Pachete & Prețuri
          </h1>
          {/* Subtitlul/descrierea */}
          <p className="text-white/40 text-sm mt-1">
            Gestionează pachetele de servicii foto/video
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Contorul de pachete active/total */}
          <span className="text-xs text-white/30 px-3 py-1.5 bg-white/[0.04] rounded-lg">
            {activeCount} active din {packages.length}
          </span>
          {/* Butonul "Adaugă pachet" - vizibil doar când NU edităm nimic */}
          {editingId === null && (
            <button
              onClick={openCreate}
              className="px-4 py-2.5 bg-[#fbbf24] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#f59e0b] transition-colors flex items-center gap-2"
            >
              <i className="fas fa-plus text-xs"></i>
              Adaugă pachet
            </button>
          )}
        </div>
      </div>

      {/* Banner informativ - explică ce face pagina */}
      <div className="mb-6 bg-[#fbbf24]/5 border border-[#fbbf24]/10 rounded-xl p-4 flex items-start gap-3">
        {/* Iconița de informare */}
        <i className="fas fa-info-circle text-[#fbbf24] mt-0.5"></i>
        <div>
          <p className="text-sm text-white/60">
            Definește pachetele afișate pe pagina de prețuri. Fiecare pachet conține{' '}
            <strong className="text-white/80">servicii incluse</strong>,{' '}
            <strong className="text-white/80">extra-uri opționale</strong> și{' '}
            <strong className="text-white/80">note</strong>. Doar pachetele{' '}
            <strong className="text-white/80">active</strong> sunt vizibile pe site.
          </p>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Formularul de creare/editare - vizibil doar când editingId nu e null */}
      {/* ================================================================= */}
      {editingId !== null && (
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] p-6 mb-6">
          {/* Titlul formularului - se schimbă între "Pachet nou" și "Editează pachet" */}
          <h2 className="text-sm font-medium text-white/70 mb-6">
            <i
              className={`fas ${editingId === 'new' ? 'fa-plus-circle' : 'fa-edit'} mr-2 text-[#fbbf24]`}
            ></i>
            {editingId === 'new' ? 'Pachet nou' : 'Editează pachet'}
          </h2>

          {/* Rândul 1: Numele pachetului + Iconița */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Câmpul pentru numele pachetului */}
            <div>
              <label className={labelCls}>
                Nume pachet <span className="text-red-400">*</span>
              </label>
              {/* Input controlat: value vine din state, onChange actualizează state-ul */}
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="ex: Pachet Nuntă Premium"
                className={inputCls}
              />
            </div>
            {/* Câmpul pentru iconița Font Awesome + previzualizare */}
            <div>
              <label className={labelCls}>Icon (Font Awesome)</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={form.icon}
                  onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  placeholder="fas fa-camera"
                  className={inputCls}
                />
                {/* Previzualizarea iconiței - afișează iconița introdusă în timp real */}
                <div className="w-10 h-10 shrink-0 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  <i className={`${form.icon} text-[#fbbf24]`}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Rândul 2: Preț + Monedă + Nivel/Tier */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Câmpul pentru preț (tip numeric) */}
            <div>
              <label className={labelCls}>
                Preț <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={form.price || ''}
                onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                placeholder="500"
                className={inputCls}
              />
            </div>
            {/* Câmpul pentru monedă */}
            <div>
              <label className={labelCls}>Monedă</label>
              <input
                type="text"
                value={form.currency}
                onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                placeholder="Euro"
                className={inputCls}
              />
            </div>
            {/* Câmpul pentru nivelul pachetului */}
            <div>
              <label className={labelCls}>Tier / Nivel</label>
              <input
                type="text"
                value={form.tier}
                onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}
                placeholder="Pachet Basic"
                className={inputCls}
              />
            </div>
          </div>

          {/* Rândul 3: Badge (etichetă opțională) + Checkbox activ/inactiv */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Câmpul pentru badge (ex: "Popular", "Recomandat") */}
            <div>
              <label className={labelCls}>Badge (opțional)</label>
              <input
                type="text"
                value={form.badge || ''}
                onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                placeholder="ex: Popular, Recomandat"
                className={inputCls}
              />
            </div>
            {/* Toggle switch (comutator) pentru activare/dezactivare pachet */}
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer select-none group">
                <div className="relative">
                  {/* Checkbox ascuns - sr-only îl face invizibil dar funcțional */}
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  {/* Fundalul toggle-ului - se schimbă culoarea când e bifat (peer-checked) */}
                  <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-[#fbbf24]/30 transition-colors"></div>
                  {/* Butonul rotund al toggle-ului - se mișcă la dreapta când e bifat */}
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white/40 rounded-full peer-checked:translate-x-5 peer-checked:bg-[#fbbf24] transition-all"></div>
                </div>
                {/* Textul de lângă toggle */}
                <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                  Pachet activ (vizibil pe site)
                </span>
              </label>
            </div>
          </div>

          {/* Linie separatoare */}
          <div className="border-t border-white/[0.06] my-6"></div>

          {/* ============================================================= */}
          {/* Secțiunea: Servicii incluse (Features) */}
          {/* Lista de servicii care vin cu pachetul */}
          {/* ============================================================= */}
          <div className="mb-6">
            {/* Header-ul secțiunii cu titlu și buton de adăugare */}
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                <i className="fas fa-list-check text-[#fbbf24] text-xs"></i>
                Servicii incluse ({form.features.length})
              </label>
              {/* Butonul care adaugă un rând nou de serviciu */}
              <button
                type="button"
                onClick={addFeature}
                className="px-3 py-1.5 text-xs bg-white/5 text-white/50 border border-white/[0.06] rounded-lg hover:bg-white/[0.08] hover:text-white/70 transition-colors flex items-center gap-1.5"
              >
                <i className="fas fa-plus text-[10px]"></i>
                Adaugă serviciu
              </button>
            </div>
            {/* Lista de servicii - fiecare rând are: iconița, câmp icon, câmp text, buton ștergere */}
            <div className="space-y-2">
              {form.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2">
                  {/* Previzualizarea iconiței serviciului */}
                  <div className="w-8 h-8 shrink-0 rounded bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <i className={`${feat.icon} text-[#fbbf24] text-[10px]`}></i>
                  </div>
                  {/* Câmpul pentru clasa CSS a iconiței */}
                  <input
                    type="text"
                    value={feat.icon}
                    onChange={e => updateFeature(i, 'icon', e.target.value)}
                    placeholder="fas fa-check"
                    className={`${smallInputCls} w-36 shrink-0`}
                  />
                  {/* Câmpul pentru textul serviciului */}
                  <input
                    type="text"
                    value={feat.text}
                    onChange={e => updateFeature(i, 'text', e.target.value)}
                    placeholder="ex: Ședință foto 2 ore"
                    className={`${smallInputCls} flex-1`}
                  />
                  {/* Butonul de ștergere a serviciului */}
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="w-8 h-8 shrink-0 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors"
                    title="Șterge"
                  >
                    <i className="fas fa-times text-red-400/60 hover:text-red-400 text-xs"></i>
                  </button>
                </div>
              ))}
              {/* Mesaj afișat când lista de servicii este goală */}
              {form.features.length === 0 && (
                <p className="text-xs text-white/20 py-3 text-center">
                  Niciun serviciu adăugat. Apasă butonul de mai sus.
                </p>
              )}
            </div>
          </div>

          {/* ============================================================= */}
          {/* Secțiunea: Servicii extra (opționale, cu preț suplimentar) */}
          {/* ============================================================= */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                <i className="fas fa-puzzle-piece text-[#fbbf24] text-xs"></i>
                Servicii extra ({form.extras.length})
              </label>
              {/* Butonul care adaugă un rând nou de extra */}
              <button
                type="button"
                onClick={addExtra}
                className="px-3 py-1.5 text-xs bg-white/5 text-white/50 border border-white/[0.06] rounded-lg hover:bg-white/[0.08] hover:text-white/70 transition-colors flex items-center gap-1.5"
              >
                <i className="fas fa-plus text-[10px]"></i>
                Adaugă extra
              </button>
            </div>
            {/* Lista de extra-uri - fiecare rând are: câmp text, câmp preț, buton ștergere */}
            <div className="space-y-2">
              {form.extras.map((ext, i) => (
                <div key={i} className="flex items-center gap-2">
                  {/* Câmpul pentru descrierea extra-ului */}
                  <input
                    type="text"
                    value={ext.text}
                    onChange={e => updateExtra(i, 'text', e.target.value)}
                    placeholder="ex: Album foto suplimentar"
                    className={`${smallInputCls} flex-1`}
                  />
                  {/* Câmpul pentru prețul extra-ului */}
                  <input
                    type="text"
                    value={ext.price}
                    onChange={e => updateExtra(i, 'price', e.target.value)}
                    placeholder="ex: +100 Euro"
                    className={`${smallInputCls} w-36 shrink-0`}
                  />
                  {/* Butonul de ștergere */}
                  <button
                    type="button"
                    onClick={() => removeExtra(i)}
                    className="w-8 h-8 shrink-0 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors"
                    title="Șterge"
                  >
                    <i className="fas fa-times text-red-400/60 hover:text-red-400 text-xs"></i>
                  </button>
                </div>
              ))}
              {/* Mesaj afișat când nu există extra-uri */}
              {form.extras.length === 0 && (
                <p className="text-xs text-white/20 py-3 text-center">
                  Niciun extra adăugat. Apasă butonul de mai sus.
                </p>
              )}
            </div>
          </div>

          {/* ============================================================= */}
          {/* Secțiunea: Note informative */}
          {/* ============================================================= */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                <i className="fas fa-sticky-note text-[#fbbf24] text-xs"></i>
                Note ({form.notes.length})
              </label>
              {/* Butonul care adaugă o notă nouă */}
              <button
                type="button"
                onClick={addNote}
                className="px-3 py-1.5 text-xs bg-white/5 text-white/50 border border-white/[0.06] rounded-lg hover:bg-white/[0.08] hover:text-white/70 transition-colors flex items-center gap-1.5"
              >
                <i className="fas fa-plus text-[10px]"></i>
                Adaugă notă
              </button>
            </div>
            {/* Lista de note - fiecare rând are: previzualizare icon, câmp icon, câmp text, buton ștergere */}
            <div className="space-y-2">
              {form.notes.map((note, i) => (
                <div key={i} className="flex items-center gap-2">
                  {/* Previzualizarea iconiței notei */}
                  <div className="w-8 h-8 shrink-0 rounded bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <i className={`${note.icon} text-[#fbbf24] text-[10px]`}></i>
                  </div>
                  {/* Câmpul pentru iconița notei */}
                  <input
                    type="text"
                    value={note.icon}
                    onChange={e => updateNote(i, 'icon', e.target.value)}
                    placeholder="fas fa-info-circle"
                    className={`${smallInputCls} w-36 shrink-0`}
                  />
                  {/* Câmpul pentru textul notei */}
                  <input
                    type="text"
                    value={note.text}
                    onChange={e => updateNote(i, 'text', e.target.value)}
                    placeholder="ex: Deplasare inclusă în București"
                    className={`${smallInputCls} flex-1`}
                  />
                  {/* Butonul de ștergere a notei */}
                  <button
                    type="button"
                    onClick={() => removeNote(i)}
                    className="w-8 h-8 shrink-0 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors"
                    title="Șterge"
                  >
                    <i className="fas fa-times text-red-400/60 hover:text-red-400 text-xs"></i>
                  </button>
                </div>
              ))}
              {/* Mesaj afișat când nu există note */}
              {form.notes.length === 0 && (
                <p className="text-xs text-white/20 py-3 text-center">
                  Nicio notă adăugată. Apasă butonul de mai sus.
                </p>
              )}
            </div>
          </div>

          {/* Linie separatoare */}
          <div className="border-t border-white/[0.06] my-6"></div>

          {/* Butoanele de acțiune: Salvează și Anulează */}
          <div className="flex items-center gap-3">
            {/* Butonul de salvare - dezactivat când se salvează sau datele sunt invalide */}
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim() || form.price <= 0}
              className="px-5 py-2.5 bg-[#fbbf24] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#f59e0b] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {/* Afișăm spinner când se salvează, sau text + iconiță când nu */}
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0a0a0a]/20 border-t-[#0a0a0a] rounded-full animate-spin"></div>
                  Se salvează...
                </>
              ) : (
                <>
                  <i className={`fas ${editingId === 'new' ? 'fa-plus' : 'fa-save'} text-xs`}></i>
                  {editingId === 'new' ? 'Creează pachet' : 'Salvează modificările'}
                </>
              )}
            </button>
            {/* Butonul de anulare - închide formularul fără a salva */}
            <button
              onClick={resetForm}
              className="px-4 py-2.5 text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Anulează
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* Lista de pachete existente */}
      {/* ================================================================= */}
      {/* Dacă nu există pachete și nu edităm, afișăm un mesaj gol */}
      {packages.length === 0 && editingId === null ? (
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] p-16 text-center">
          {/* Iconița de cutie goală */}
          <i className="fas fa-box-open text-4xl text-white/10 mb-4 block"></i>
          <p className="text-white/30 mb-2">Niciun pachet încă</p>
          <p className="text-white/20 text-sm mb-6">
            Adaugă primul pachet de servicii
          </p>
          {/* Buton de creare primul pachet */}
          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-[#fbbf24] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#f59e0b] transition-colors inline-flex items-center gap-2"
          >
            <i className="fas fa-plus text-xs"></i>
            Adaugă pachet
          </button>
        </div>
      ) : (
        // Dacă există pachete, le afișăm ca o listă
        <div className="space-y-3">
          {/* Iterăm prin fiecare pachet și creăm un card pentru el */}
          {packages.map(pkg => {
            // Verificăm dacă acest pachet este cel care se editează acum
            const isBeingEdited = editingId === pkg.id

            return (
              // Card-ul pachetului - stilul se schimbă dacă e editat sau inactiv
              <div
                key={pkg.id}
                className={`group bg-[#111111] rounded-xl border overflow-hidden transition-all ${
                  isBeingEdited
                    ? 'border-[#fbbf24]/30 ring-1 ring-[#fbbf24]/10'  // Stil evidențiat când se editează
                    : pkg.isActive
                      ? 'border-white/[0.06]'                          // Stil normal când e activ
                      : 'border-white/[0.03] opacity-50'               // Stil atenuat când e inactiv
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Iconița pachetului */}
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <i className={`${pkg.icon} text-[#fbbf24] text-lg`}></i>
                  </div>

                  {/* Informațiile pachetului: nume, badge, preț, tier, status */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {/* Numele pachetului */}
                      <h3 className="text-sm text-white/80 font-medium truncate">{pkg.name}</h3>
                      {/* Badge-ul (dacă există) - ex: "Popular" */}
                      {pkg.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fbbf24]/10 text-[#fbbf24] font-medium shrink-0">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    {/* Prețul și nivelul */}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-lg font-semibold text-white/90">
                        {pkg.price} {pkg.currency}
                      </span>
                      <span className="text-xs text-white/30">{pkg.tier}</span>
                    </div>
                    {/* Statistici: status activ/inactiv, număr servicii, extra-uri, note */}
                    <div className="flex items-center gap-3 mt-1.5">
                      {/* Badge-ul de status (ACTIV / INACTIV) */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded ${
                          pkg.isActive
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-white/5 text-white/30'
                        }`}
                      >
                        {pkg.isActive ? 'ACTIV' : 'INACTIV'}
                      </span>
                      {/* Numărul de servicii incluse */}
                      <span className="text-[10px] text-white/20">
                        <i className="fas fa-check-circle mr-1"></i>
                        {pkg.features.length} servicii
                      </span>
                      {/* Numărul de extra-uri (doar dacă există) */}
                      {pkg.extras.length > 0 && (
                        <span className="text-[10px] text-white/20">
                          <i className="fas fa-puzzle-piece mr-1"></i>
                          {pkg.extras.length} extra
                        </span>
                      )}
                      {/* Numărul de note (doar dacă există) */}
                      {pkg.notes.length > 0 && (
                        <span className="text-[10px] text-white/20">
                          <i className="fas fa-sticky-note mr-1"></i>
                          {pkg.notes.length} note
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Butoanele de acțiune: Editează, Activează/Dezactivează, Șterge */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Butonul de editare - dacă deja editează, devine buton de închidere */}
                    <button
                      onClick={() => (isBeingEdited ? resetForm() : openEdit(pkg))}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isBeingEdited
                          ? 'bg-[#fbbf24]/20 text-[#fbbf24]'
                          : 'bg-white/[0.04] hover:bg-white/[0.08]'
                      }`}
                      title={isBeingEdited ? 'Închide' : 'Editează'}
                    >
                      <i
                        className={`fas ${isBeingEdited ? 'fa-chevron-up' : 'fa-edit'} text-xs ${
                          isBeingEdited ? '' : 'text-white/40'
                        }`}
                      ></i>
                    </button>
                    {/* Butonul de activare/dezactivare (toggle vizibilitate) */}
                    <button
                      onClick={() => handleToggle(pkg.id, pkg.isActive)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        pkg.isActive
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20'
                          : 'bg-white/[0.04] hover:bg-white/[0.08]'
                      }`}
                      title={pkg.isActive ? 'Dezactivează' : 'Activează'}
                    >
                      <i
                        className={`fas ${pkg.isActive ? 'fa-eye' : 'fa-eye-slash'} text-xs ${
                          pkg.isActive ? 'text-emerald-400' : 'text-white/40'
                        }`}
                      ></i>
                    </button>
                    {/* Butonul de ștergere */}
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-red-500/20 flex items-center justify-center transition-colors"
                      title="Șterge"
                    >
                      <i className="fas fa-trash text-red-400/60 hover:text-red-400 text-xs"></i>
                    </button>
                  </div>
                </div>

                {/* Previzualizarea serviciilor - afișată când pachetul NU este în modul editare */}
                {/* Arată primele 4 servicii incluse ca badge-uri */}
                {!isBeingEdited && (pkg.features.length > 0 || pkg.extras.length > 0) && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="border-t border-white/[0.04] pt-3 flex flex-wrap gap-x-6 gap-y-2">
                      {pkg.features.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {/* Afișăm maxim primele 4 servicii */}
                          {pkg.features.slice(0, 4).map((f, i) => (
                            <span
                              key={i}
                              className="text-[11px] text-white/30 bg-white/[0.03] rounded px-2 py-1 flex items-center gap-1.5"
                            >
                              <i className={`${f.icon} text-[#fbbf24]/40 text-[9px]`}></i>
                              {f.text}
                            </span>
                          ))}
                          {/* Dacă sunt mai mult de 4, afișăm "+N mai mult" */}
                          {pkg.features.length > 4 && (
                            <span className="text-[11px] text-white/20 px-2 py-1">
                              +{pkg.features.length - 4} mai mult
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
