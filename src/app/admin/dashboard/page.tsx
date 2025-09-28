'use client'

import { Category, Event, Image } from '@/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DashboardStats {
  categoriesCount: number
  eventsCount: number
  imagesCount: number
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    categoriesCount: 0,
    eventsCount: 0,
    imagesCount: 0
  })
  const [recentItems, setRecentItems] = useState<{
    categories: Category[]
    events: Event[]
    images: Image[]
  }>({
    categories: [],
    events: [],
    images: []
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard')
        if (!response.ok) {
          throw new Error('Eroare la încărcarea datelor dashboard')
        }
        const data = await response.json()
        setStats(data.stats)
        setRecentItems(data.recentItems)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: 'Categorii',
      value: stats.categoriesCount,
      href: '/admin/categories',
      icon: '📁',
      color: 'bg-blue-500'
    },
    {
      title: 'Evenimente',
      value: stats.eventsCount,
      href: '/admin/events',
      icon: '📅',
      color: 'bg-green-500'
    },
    {
      title: 'Imagini',
      value: stats.imagesCount,
      href: '/admin/images',
      icon: '🖼️',
      color: 'bg-purple-500'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bine ai venit în panoul de administrare!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Link
            key={index}
            href={card.href}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${card.color} rounded-lg p-3`}>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acțiuni rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/categories/new"
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <div className="text-center">
              <span className="block text-2xl mb-2">📁</span>
              <span className="text-sm font-medium text-gray-600">Adaugă Categorie</span>
            </div>
          </Link>
          <Link
            href="/admin/events/new"
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <div className="text-center">
              <span className="block text-2xl mb-2">📅</span>
              <span className="text-sm font-medium text-gray-600">Adaugă Eveniment</span>
            </div>
          </Link>
          <Link
            href="/admin/images/upload"
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <div className="text-center">
              <span className="block text-2xl mb-2">📤</span>
              <span className="text-sm font-medium text-gray-600">Încarcă Imagini</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activitate recentă</h2>
        {recentItems.categories.length === 0 && recentItems.events.length === 0 && recentItems.images.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            <p>Nu există activitate recentă</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentItems.categories.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Categorii recente</h3>
                <div className="space-y-2">
                  {recentItems.categories.slice(0, 3).map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-900">{category.name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(category.createdAt).toLocaleDateString('ro-RO')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {recentItems.events.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Evenimente recente</h3>
                <div className="space-y-2">
                  {recentItems.events.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-900">{event.name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(event.createdAt).toLocaleDateString('ro-RO')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {recentItems.images.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Imagini recente</h3>
                <div className="space-y-2">
                  {recentItems.images.slice(0, 3).map((image) => (
                    <div key={image.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-900">{image.filename}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(image.createdAt).toLocaleDateString('ro-RO')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}