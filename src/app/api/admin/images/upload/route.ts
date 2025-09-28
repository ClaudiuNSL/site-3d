import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const formData = await request.formData()
    const eventId = formData.get('eventId') as string
    const images = formData.getAll('images') as File[]

    if (!eventId) {
      return NextResponse.json({ error: 'ID-ul evenimentului este obligatoriu' }, { status: 400 })
    }

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'Nu au fost selectate imagini' }, { status: 400 })
    }

    // Check if event exists
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { images: true }
    })

    if (!event) {
      return NextResponse.json({ error: 'Evenimentul nu a fost găsit' }, { status: 404 })
    }

    const uploadedImages = []
    const maxOrder = event.images.length > 0
      ? Math.max(...event.images.map(img => img.order))
      : 0

    for (let i = 0; i < images.length; i++) {
      const file = images[i]

      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue // Skip non-image files
      }

      // Validate file size (50MB max for high-quality photos)
      if (file.size > 50 * 1024 * 1024) {
        continue // Skip files larger than 50MB
      }

      try {
        // Generate unique filename
        const fileExtension = file.name.split('.').pop()
        const fileName = `${eventId}-${Date.now()}-${i}.${fileExtension}`

        // Upload to Vercel Blob
        const blob = await put(fileName, file, {
          access: 'public',
          addRandomSuffix: false
        })

        // Save to database
        const imageRecord = await db.image.create({
          data: {
            filename: fileName,
            originalName: file.name,
            url: blob.url,
            eventId,
            order: maxOrder + i + 1,
            alt: `Image ${i + 1} from ${event.name}`,
            size: file.size
          }
        })

        uploadedImages.push(imageRecord)
      } catch (error) {
        console.error(`Error uploading image ${file.name}:`, error)
        // Continue with other images
      }
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { error: 'Nu s-au putut încărca imaginile. Verifică că sunt în format valid și sub 50MB.' },
        { status: 400 }
      )
    }

    return NextResponse.json(uploadedImages, { status: 201 })
  } catch (error) {
    console.error('Error uploading images:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea imaginilor' },
      { status: 500 }
    )
  }
}