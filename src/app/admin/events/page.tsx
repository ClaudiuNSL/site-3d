'use client'

import { Category, Event } from '@/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const fetchData = async () => {
    try {
      const [eventsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/events'),
        fetch('/api/admin/categories')
      ])
      if (!eventsRes.ok || !categoriesRes.ok) throw new Error('Eroare la încărcarea datelor')
      const [eventsData, categoriesData] = await Promise.all([eventsRes.json(), categoriesRes.json()])
      setEvents(eventsData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Ești sigur că vrei să ștergi evenimentul "${name}"?`)) return
    try {
      const response = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Eroare la ștergerea evenimentului')
      }
      setEvents(events.filter(event => event.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Eroare la ștergerea evenimentului')
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      if (!response.ok) throw new Error('Eroare la actualizarea statusului')
      const updatedEvent = await response.json()
      setEvents(events.map(event => event.id === id ? updatedEvent : event))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Eroare la actualizarea statusului')
    }
  }

  const filteredEvents = selectedCategory === 'all' ? events : events.filter(event => event.categoryId === selectedCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light text-white" style={{fontFamily: "'Playfair Display', serif"}}>Evenimente</h1>
          <p className="text-white/40 text-sm mt-1">Gestionează evenimentele pentru fiecare categorie</p>
        </div>
        <Link href="/admin/events/new" className="flex items-center gap-2 px-4 py-2.5 bg-[#fbbf24] text-[#0a0a0a] text-sm font-medium rounded-lg hover:bg-[#f59e0b] transition-colors">
          <i className="fas fa-plus text-xs"></i>
          Adaugă eveniment
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategory === 'all' ? 'bg-[#fbbf24] text-[#0a0a0a] font-medium' : 'bg-[#111111] text-white/50 border border-white/[0.06] hover:text-white/80'}`}>
            Toate
          </button>
          {categories.map((category) => (
            <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategory === category.id ? 'bg-[#fbbf24] text-[#0a0a0a] font-medium' : 'bg-[#111111] text-white/50 border border-white/[0.06] hover:text-white/80'}`}>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="bg-[#111111] rounded-xl border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">Eveniment</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">Categorie</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">Imagini</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider">Data</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredEvents.map((event) => (
              <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <p className="text-sm text-white/90 font-medium">{event.name}</p>
                  <p className="text-xs text-white/30">/{event.slug}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-[#fbbf24]/10 text-[#fbbf24]">
                    {event.category?.name}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-white/60">{event.images?.length || 0}</span>
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => toggleActive(event.id, event.isActive)} className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${event.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${event.isActive ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                    {event.isActive ? 'Activ' : 'Inactiv'}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-white/50">{event.date ? new Date(event.date).toLocaleDateString('ro-RO') : '—'}</span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/events/${event.id}/images`} className="text-white/40 hover:text-blue-400 transition-colors" title="Imagini">
                      <i className="fas fa-images text-xs"></i>
                    </Link>
                    <Link href={`/admin/events/${event.id}`} className="text-white/40 hover:text-[#fbbf24] transition-colors" title="Editează">
                      <i className="fas fa-pen text-xs"></i>
                    </Link>
                    <button onClick={() => handleDelete(event.id, event.name)} disabled={event.images?.length ? event.images.length > 0 : false} className="text-white/40 hover:text-red-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed" title="Șterge">
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEvents.length === 0 && (
          <div className="px-5 py-16 text-center">
            <i className="fas fa-calendar-alt text-white/10 text-4xl mb-3"></i>
            <p className="text-white/30 text-sm mb-3">{selectedCategory === 'all' ? 'Nu există evenimente încă' : 'Nu există evenimente pentru categoria selectată'}</p>
            <Link href="/admin/events/new" className="text-[#fbbf24] text-sm hover:underline">Adaugă primul eveniment</Link>
          </div>
        )}
      </div>
    </div>
  )
}
