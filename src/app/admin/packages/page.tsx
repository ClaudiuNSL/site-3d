'use client'

import { useEffect, useState, useCallback } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PackageFeature {
  icon: string
  text: string
}

interface PackageExtra {
  text: string
  price: string
}

interface PackageNote {
  icon: string
  text: string
}

interface ServicePackage {
  id: string
  name: string
  icon: string
  price: number
  currency: string
  tier: string
  badge: string | null
  isActive: boolean
  features: PackageFeature[]
  extras: PackageExtra[]
  notes: PackageNote[]
  createdAt?: string
  updatedAt?: string
}

// ---------------------------------------------------------------------------
// Blank form helpers
// ---------------------------------------------------------------------------

const blankForm = (): Omit<ServicePackage, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '',
  icon: 'fas fa-camera',
  price: 0,
  currency: 'Euro',
  tier: 'Pachet Basic',
  badge: null,
  isActive: true,
  features: [{ icon: 'fas fa-check', text: '' }],
  extras: [],
  notes: [],
})

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function PackagesPage() {
  const [packages, setPackages] = useState<ServicePackage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Which package is being edited (id), or 'new' for creating
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state (mirrors ServicePackage fields without id)
  const [form, setForm] = useState(blankForm())

  // -----------------------------------------------------------------------
  // Fetch
  // -----------------------------------------------------------------------

  const fetchPackages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/packages')
      if (res.ok) {
        const data = await res.json()
        setPackages(data)
      }
    } catch (err) {
      console.error('Error fetching packages:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  // -----------------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------------

  const resetForm = () => {
    setEditingId(null)
    setForm(blankForm())
  }

  const openCreate = () => {
    setEditingId('new')
    setForm(blankForm())
  }

  const openEdit = (pkg: ServicePackage) => {
    setEditingId(pkg.id)
    setForm({
      name: pkg.name,
      icon: pkg.icon,
      price: pkg.price,
      currency: pkg.currency,
      tier: pkg.tier,
      badge: pkg.badge,
      isActive: pkg.isActive,
      features: pkg.features.length > 0 ? pkg.features : [{ icon: 'fas fa-check', text: '' }],
      extras: pkg.extras.length > 0 ? pkg.extras : [],
      notes: pkg.notes.length > 0 ? pkg.notes : [],
    })
  }

  // -----------------------------------------------------------------------
  // CRUD
  // -----------------------------------------------------------------------

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert('Introdu un nume pentru pachet')
      return
    }
    if (form.price <= 0) {
      alert('Prețul trebuie să fie mai mare decât 0')
      return
    }

    setSaving(true)

    try {
      const body = {
        ...form,
        badge: form.badge?.trim() || null,
        // Filter out empty rows
        features: form.features.filter(f => f.text.trim()),
        extras: form.extras.filter(e => e.text.trim()),
        notes: form.notes.filter(n => n.text.trim()),
      }

      const isNew = editingId === 'new'
      const res = isNew
        ? await fetch('/api/admin/packages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        : await fetch(`/api/admin/packages/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })

      if (res.ok) {
        resetForm()
        await fetchPackages()
      } else {
        const err = await res.json()
        alert(err.error || 'Eroare la salvare')
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('Eroare la salvare')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi acest pachet? Acțiunea este ireversibilă.')) return

    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPackages(packages.filter(p => p.id !== id))
        if (editingId === id) resetForm()
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      if (res.ok) {
        setPackages(packages.map(p => (p.id === id ? { ...p, isActive: !isActive } : p)))
      }
    } catch (err) {
      console.error('Toggle error:', err)
    }
  }

  // -----------------------------------------------------------------------
  // Dynamic list helpers
  // -----------------------------------------------------------------------

  const addFeature = () =>
    setForm(f => ({ ...f, features: [...f.features, { icon: 'fas fa-check', text: '' }] }))
  const removeFeature = (i: number) =>
    setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }))
  const updateFeature = (i: number, field: keyof PackageFeature, value: string) =>
    setForm(f => ({
      ...f,
      features: f.features.map((feat, idx) => (idx === i ? { ...feat, [field]: value } : feat)),
    }))

  const addExtra = () =>
    setForm(f => ({ ...f, extras: [...f.extras, { text: '', price: '' }] }))
  const removeExtra = (i: number) =>
    setForm(f => ({ ...f, extras: f.extras.filter((_, idx) => idx !== i) }))
  const updateExtra = (i: number, field: keyof PackageExtra, value: string) =>
    setForm(f => ({
      ...f,
      extras: f.extras.map((ext, idx) => (idx === i ? { ...ext, [field]: value } : ext)),
    }))

  const addNote = () =>
    setForm(f => ({ ...f, notes: [...f.notes, { icon: 'fas fa-info-circle', text: '' }] }))
  const removeNote = (i: number) =>
    setForm(f => ({ ...f, notes: f.notes.filter((_, idx) => idx !== i) }))
  const updateNote = (i: number, field: keyof PackageNote, value: string) =>
    setForm(f => ({
      ...f,
      notes: f.notes.map((note, idx) => (idx === i ? { ...note, [field]: value } : note)),
    }))

  // -----------------------------------------------------------------------
  // Counts
  // -----------------------------------------------------------------------

  const activeCount = packages.filter(p => p.isActive).length

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin"></div>
      </div>
    )
  }

  // -----------------------------------------------------------------------
  // Input class strings (reusable)
  // -----------------------------------------------------------------------

  const inputCls =
    'w-full px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#fbbf24]/40 focus:ring-1 focus:ring-[#fbbf24]/20 transition-colors'
  const labelCls = 'block text-sm font-medium text-white/60 mb-1.5'
  const smallInputCls =
    'px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#fbbf24]/40 focus:ring-1 focus:ring-[#fbbf24]/20 transition-colors'

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-light text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Pachete & Prețuri
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Gestionează pachetele de servicii foto/video
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30 px-3 py-1.5 bg-white/[0.04] rounded-lg">
            {activeCount} active din {packages.length}
          </span>
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

      {/* Info banner */}
      <div className="mb-6 bg-[#fbbf24]/5 border border-[#fbbf24]/10 rounded-xl p-4 flex items-start gap-3">
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
      {/* Edit / Create Form (shown when editingId is set) */}
      {/* ================================================================= */}
      {editingId !== null && (
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] p-6 mb-6">
          <h2 className="text-sm font-medium text-white/70 mb-6">
            <i
              className={`fas ${editingId === 'new' ? 'fa-plus-circle' : 'fa-edit'} mr-2 text-[#fbbf24]`}
            ></i>
            {editingId === 'new' ? 'Pachet nou' : 'Editează pachet'}
          </h2>

          {/* Row 1: Name + Icon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>
                Nume pachet <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="ex: Pachet Nuntă Premium"
                className={inputCls}
              />
            </div>
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
                <div className="w-10 h-10 shrink-0 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                  <i className={`${form.icon} text-[#fbbf24]`}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Price + Currency + Tier */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

          {/* Row 3: Badge + Active */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer select-none group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-[#fbbf24]/30 transition-colors"></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white/40 rounded-full peer-checked:translate-x-5 peer-checked:bg-[#fbbf24] transition-all"></div>
                </div>
                <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                  Pachet activ (vizibil pe site)
                </span>
              </label>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06] my-6"></div>

          {/* ============================================================= */}
          {/* Features (Servicii incluse) */}
          {/* ============================================================= */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                <i className="fas fa-list-check text-[#fbbf24] text-xs"></i>
                Servicii incluse ({form.features.length})
              </label>
              <button
                type="button"
                onClick={addFeature}
                className="px-3 py-1.5 text-xs bg-white/5 text-white/50 border border-white/[0.06] rounded-lg hover:bg-white/[0.08] hover:text-white/70 transition-colors flex items-center gap-1.5"
              >
                <i className="fas fa-plus text-[10px]"></i>
                Adaugă serviciu
              </button>
            </div>
            <div className="space-y-2">
              {form.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 shrink-0 rounded bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <i className={`${feat.icon} text-[#fbbf24] text-[10px]`}></i>
                  </div>
                  <input
                    type="text"
                    value={feat.icon}
                    onChange={e => updateFeature(i, 'icon', e.target.value)}
                    placeholder="fas fa-check"
                    className={`${smallInputCls} w-36 shrink-0`}
                  />
                  <input
                    type="text"
                    value={feat.text}
                    onChange={e => updateFeature(i, 'text', e.target.value)}
                    placeholder="ex: Ședință foto 2 ore"
                    className={`${smallInputCls} flex-1`}
                  />
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
              {form.features.length === 0 && (
                <p className="text-xs text-white/20 py-3 text-center">
                  Niciun serviciu adăugat. Apasă butonul de mai sus.
                </p>
              )}
            </div>
          </div>

          {/* ============================================================= */}
          {/* Extras (Servicii extra) */}
          {/* ============================================================= */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                <i className="fas fa-puzzle-piece text-[#fbbf24] text-xs"></i>
                Servicii extra ({form.extras.length})
              </label>
              <button
                type="button"
                onClick={addExtra}
                className="px-3 py-1.5 text-xs bg-white/5 text-white/50 border border-white/[0.06] rounded-lg hover:bg-white/[0.08] hover:text-white/70 transition-colors flex items-center gap-1.5"
              >
                <i className="fas fa-plus text-[10px]"></i>
                Adaugă extra
              </button>
            </div>
            <div className="space-y-2">
              {form.extras.map((ext, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ext.text}
                    onChange={e => updateExtra(i, 'text', e.target.value)}
                    placeholder="ex: Album foto suplimentar"
                    className={`${smallInputCls} flex-1`}
                  />
                  <input
                    type="text"
                    value={ext.price}
                    onChange={e => updateExtra(i, 'price', e.target.value)}
                    placeholder="ex: +100 Euro"
                    className={`${smallInputCls} w-36 shrink-0`}
                  />
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
              {form.extras.length === 0 && (
                <p className="text-xs text-white/20 py-3 text-center">
                  Niciun extra adăugat. Apasă butonul de mai sus.
                </p>
              )}
            </div>
          </div>

          {/* ============================================================= */}
          {/* Notes */}
          {/* ============================================================= */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                <i className="fas fa-sticky-note text-[#fbbf24] text-xs"></i>
                Note ({form.notes.length})
              </label>
              <button
                type="button"
                onClick={addNote}
                className="px-3 py-1.5 text-xs bg-white/5 text-white/50 border border-white/[0.06] rounded-lg hover:bg-white/[0.08] hover:text-white/70 transition-colors flex items-center gap-1.5"
              >
                <i className="fas fa-plus text-[10px]"></i>
                Adaugă notă
              </button>
            </div>
            <div className="space-y-2">
              {form.notes.map((note, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 shrink-0 rounded bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <i className={`${note.icon} text-[#fbbf24] text-[10px]`}></i>
                  </div>
                  <input
                    type="text"
                    value={note.icon}
                    onChange={e => updateNote(i, 'icon', e.target.value)}
                    placeholder="fas fa-info-circle"
                    className={`${smallInputCls} w-36 shrink-0`}
                  />
                  <input
                    type="text"
                    value={note.text}
                    onChange={e => updateNote(i, 'text', e.target.value)}
                    placeholder="ex: Deplasare inclusă în București"
                    className={`${smallInputCls} flex-1`}
                  />
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
              {form.notes.length === 0 && (
                <p className="text-xs text-white/20 py-3 text-center">
                  Nicio notă adăugată. Apasă butonul de mai sus.
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06] my-6"></div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim() || form.price <= 0}
              className="px-5 py-2.5 bg-[#fbbf24] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#f59e0b] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
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
      {/* Packages List */}
      {/* ================================================================= */}
      {packages.length === 0 && editingId === null ? (
        <div className="bg-[#111111] rounded-xl border border-white/[0.06] p-16 text-center">
          <i className="fas fa-box-open text-4xl text-white/10 mb-4 block"></i>
          <p className="text-white/30 mb-2">Niciun pachet încă</p>
          <p className="text-white/20 text-sm mb-6">
            Adaugă primul pachet de servicii
          </p>
          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-[#fbbf24] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#f59e0b] transition-colors inline-flex items-center gap-2"
          >
            <i className="fas fa-plus text-xs"></i>
            Adaugă pachet
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {packages.map(pkg => {
            const isBeingEdited = editingId === pkg.id

            return (
              <div
                key={pkg.id}
                className={`group bg-[#111111] rounded-xl border overflow-hidden transition-all ${
                  isBeingEdited
                    ? 'border-[#fbbf24]/30 ring-1 ring-[#fbbf24]/10'
                    : pkg.isActive
                      ? 'border-white/[0.06]'
                      : 'border-white/[0.03] opacity-50'
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Icon */}
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <i className={`${pkg.icon} text-[#fbbf24] text-lg`}></i>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm text-white/80 font-medium truncate">{pkg.name}</h3>
                      {pkg.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fbbf24]/10 text-[#fbbf24] font-medium shrink-0">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-lg font-semibold text-white/90">
                        {pkg.price} {pkg.currency}
                      </span>
                      <span className="text-xs text-white/30">{pkg.tier}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded ${
                          pkg.isActive
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-white/5 text-white/30'
                        }`}
                      >
                        {pkg.isActive ? 'ACTIV' : 'INACTIV'}
                      </span>
                      <span className="text-[10px] text-white/20">
                        <i className="fas fa-check-circle mr-1"></i>
                        {pkg.features.length} servicii
                      </span>
                      {pkg.extras.length > 0 && (
                        <span className="text-[10px] text-white/20">
                          <i className="fas fa-puzzle-piece mr-1"></i>
                          {pkg.extras.length} extra
                        </span>
                      )}
                      {pkg.notes.length > 0 && (
                        <span className="text-[10px] text-white/20">
                          <i className="fas fa-sticky-note mr-1"></i>
                          {pkg.notes.length} note
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
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
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="w-9 h-9 rounded-lg bg-white/[0.04] hover:bg-red-500/20 flex items-center justify-center transition-colors"
                      title="Șterge"
                    >
                      <i className="fas fa-trash text-red-400/60 hover:text-red-400 text-xs"></i>
                    </button>
                  </div>
                </div>

                {/* Expanded preview (collapsed features/extras/notes) */}
                {!isBeingEdited && (pkg.features.length > 0 || pkg.extras.length > 0) && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="border-t border-white/[0.04] pt-3 flex flex-wrap gap-x-6 gap-y-2">
                      {pkg.features.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {pkg.features.slice(0, 4).map((f, i) => (
                            <span
                              key={i}
                              className="text-[11px] text-white/30 bg-white/[0.03] rounded px-2 py-1 flex items-center gap-1.5"
                            >
                              <i className={`${f.icon} text-[#fbbf24]/40 text-[9px]`}></i>
                              {f.text}
                            </span>
                          ))}
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
