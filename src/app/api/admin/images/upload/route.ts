import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { put } from '@vercel/blob'
import { saveFileLocally } from '@/lib/local-storage'
import { NextRequest, NextResponse } from 'next/server'

// Configurare pentru body size mare (Next.js 16+)
export const maxDuration = 300 // 5 minute timeout pentru upload-uri mari
export const dynamic = 'force-dynamic'

// Verifică dacă avem token Vercel Blob
const hasVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const formData = await request.formData()
    const eventId = formData.get('eventId') as string
    const files = formData.getAll('images') as File[] // Numele rămâne 'images' dar acceptăm și video

    if (!eventId) {
      return NextResponse.json({ error: 'ID-ul evenimentului este obligatoriu' }, { status: 400 })
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Nu au fost selectate fișiere' }, { status: 400 })
    }

    // Check if event exists
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { images: true }
    })

    if (!event) {
      return NextResponse.json({ error: 'Evenimentul nu a fost găsit' }, { status: 404 })
    }

    const uploadedFiles = []
    const maxOrder = event.images.length > 0
      ? Math.max(...event.images.map(img => img.order))
      : 0

    // Tipuri de fișiere acceptate
    const acceptedTypes = [
      // Imagini
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif',
      // Video
      'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'
    ]

    console.log(`Storage mode: ${hasVercelBlob ? 'Vercel Blob' : 'Local Disk'}`)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validare tip fișier
      if (!acceptedTypes.includes(file.type)) {
        console.log(`Skipping file ${file.name} - unsupported type: ${file.type}`)
        continue // Skip fișiere neacceptate
      }

      // Validare dimensiune fișier (500MB max - suficient pentru video 4K)
      const maxSize = 500 * 1024 * 1024 // 500MB
      if (file.size > maxSize) {
        console.log(`Skipping file ${file.name} - too large: ${file.size} bytes`)
        continue // Skip fișiere prea mari
      }

      try {
        // Generare nume unic
        const fileExtension = file.name.split('.').pop()
        const fileName = `${eventId}-${Date.now()}-${i}.${fileExtension}`

        console.log(`Uploading ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)...`)

        let fileUrl: string

        // Folosește Vercel Blob sau Local Storage
        if (hasVercelBlob) {
          // Upload către Vercel Blob
          const blob = await put(fileName, file, {
            access: 'public',
            addRandomSuffix: false,
          })
          fileUrl = blob.url
        } else {
          // Salvează local
          const result = await saveFileLocally(file, fileName)
          fileUrl = result.url
        }

        // Determină dacă e imagine sau video
        const isVideo = file.type.startsWith('video/')

        // Salvare în baza de date
        const fileRecord = await db.image.create({
          data: {
            filename: fileName,
            originalName: file.name,
            url: fileUrl,
            mimeType: file.type,
            eventId,
            order: maxOrder + i + 1,
            alt: isVideo 
              ? `Video ${i + 1} from ${event.name}` 
              : `Image ${i + 1} from ${event.name}`,
            size: file.size
          }
        })

        uploadedFiles.push(fileRecord)
        console.log(`Successfully uploaded ${file.name}`)
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error)
        // Continuă cu celelalte fișiere
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: 'Nu s-au putut încărca fișierele. Verifică că sunt în format valid (JPG, PNG, MP4, MOV) și sub 500MB.' },
        { status: 400 }
      )
    }

    return NextResponse.json(uploadedFiles, { status: 201 })
  } catch (error) {
    console.error('Error uploading files:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea fișierelor' },
      { status: 500 }
    )
  }
}