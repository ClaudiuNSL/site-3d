import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    // Get counts for all entities
    const [categoriesCount, eventsCount, imagesCount] = await Promise.all([
      db.category.count(),
      db.event.count(),
      db.image.count()
    ])

    // Get recent items
    const [recentCategories, recentEvents, recentImages] = await Promise.all([
      db.category.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      }),
      db.event.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true
        }
      }),
      db.image.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          event: true
        }
      })
    ])

    return NextResponse.json({
      stats: {
        categoriesCount,
        eventsCount,
        imagesCount
      },
      recentItems: {
        categories: recentCategories,
        events: recentEvents,
        images: recentImages
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea datelor dashboard' },
      { status: 500 }
    )
  }
}
