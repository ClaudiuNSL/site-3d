import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// Salvează o înregistrare în DB după ce upload-ul direct la Vercel Blob s-a finalizat
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const { eventId, url, pathname, contentType, size } = await request.json()

    if (!eventId || !url) {
      return NextResponse.json({ error: 'eventId și url sunt obligatorii' }, { status: 400 })
    }

    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { images: true }
    })

    if (!event) {
      return NextResponse.json({ error: 'Evenimentul nu a fost găsit' }, { status: 404 })
    }

    const maxOrder = event.images.length > 0
      ? Math.max(...event.images.map(img => img.order))
      : 0

    const isVideo = contentType?.startsWith('video/') || false
    const filename = pathname?.split('/').pop() || `upload-${Date.now()}`

    const record = await db.image.create({
      data: {
        filename,
        originalName: filename,
        url,
        mimeType: contentType || 'image/jpeg',
        eventId,
        order: maxOrder + 1,
        alt: isVideo
          ? `Video from ${event.name}`
          : `Image from ${event.name}`,
        size: size || null
      }
    })

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('Error saving image record:', error)
    return NextResponse.json(
      { error: 'Eroare la salvarea înregistrării' },
      { status: 500 }
    )
  }
}
