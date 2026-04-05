import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const slides = await db.heroSlide.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(slides)
  } catch (error) {
    console.error('Error fetching hero slides:', error)
    return NextResponse.json({ error: 'Eroare la încărcarea slide-urilor' }, { status: 500 })
  }
}
