import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const images = await db.image.findMany({
      include: {
        event: {
          include: {
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(images)
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea imaginilor' },
      { status: 500 }
    )
  }
}