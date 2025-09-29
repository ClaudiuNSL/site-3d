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

      if (!eventsRes.ok || !categoriesRes.ok) {
        throw new Error('Eroare la încărcarea datelor')
      }

      const [eventsData, categoriesData] = await Promise.all([
        eventsRes.json(),
        categoriesRes.json()
      ])

      setEvents(eventsData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Ești sigur că vrei să ștergi evenimentul "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE'
      })

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
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (!response.ok) {
        throw new Error('Eroare la actualizarea statusului')
      }

      const updatedEvent = await response.json()
      setEvents(events.map(event =>
        event.id === id ? updatedEvent : event
      ))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Eroare la actualizarea statusului')
    }
  }

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(event => event.categoryId === selectedCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Evenimente</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestionează evenimentele pentru fiecare categorie foto.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/events/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto"
          >
            Adaugă eveniment
          </Link>
        </div>
      </div>

      {/* Filter by Category */}
      <div className="mt-6">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filtrează după categorie:
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="all">Toate categoriile</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eveniment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descriere
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imagini
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Acțiuni</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {event.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              /{event.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          {event.category?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {event.description ?
                            (event.description.length > 50 ?
                              event.description.substring(0, 50) + '...' :
                              event.description
                            ) :
                            '-'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.images?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleActive(event.id, event.isActive)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            event.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {event.isActive ? 'Activ' : 'Inactiv'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {event.date ?
                          new Date(event.date).toLocaleDateString('ro-RO') :
                          '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Link
                          href={`/admin/events/${event.id}/images`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Imagini
                        </Link>
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Editează
                        </Link>
                        <button
                          onClick={() => handleDelete(event.id, event.name)}
                          className="text-red-600 hover:text-red-900"
                          disabled={event.images?.length ? event.images.length > 0 : false}
                        >
                          Șterge
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {selectedCategory === 'all'
                      ? 'Nu există evenimente încă.'
                      : 'Nu există evenimente pentru categoria selectată.'
                    }
                  </p>
                  <Link
                    href="/admin/events/new"
                    className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-600 bg-purple-100 hover:bg-purple-200"
                  >
                    Adaugă primul eveniment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}