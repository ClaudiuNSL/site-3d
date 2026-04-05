import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// Public API - used by homepage
export async function GET() {
  try {
    const video = await db.showreelVideo.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error fetching showreel:', error)
    return NextResponse.json(null)
  }
}
