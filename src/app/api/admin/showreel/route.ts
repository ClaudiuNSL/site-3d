import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const videos = await db.showreelVideo.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching showreel videos:', error)
    return NextResponse.json({ error: 'Eroare' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const body = await request.json()
    const { title, subtitle, videoUrl, thumbnailUrl } = body

    if (!videoUrl) {
      return NextResponse.json({ error: 'URL-ul video este obligatoriu' }, { status: 400 })
    }

    const video = await db.showreelVideo.create({
      data: {
        title: title || 'Showreel',
        subtitle: subtitle || null,
        videoUrl,
        thumbnailUrl: thumbnailUrl || null,
        isActive: true,
      }
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error creating showreel:', error)
    return NextResponse.json({ error: 'Eroare la salvare' }, { status: 500 })
  }
}
