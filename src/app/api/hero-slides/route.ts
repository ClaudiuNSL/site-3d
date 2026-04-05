import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// Public API - used by homepage
export async function GET() {
  try {
    const slides = await db.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(slides)
  } catch (error) {
    console.error('Error fetching hero slides:', error)
    return NextResponse.json([])
  }
}
