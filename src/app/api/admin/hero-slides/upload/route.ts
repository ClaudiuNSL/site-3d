import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { put } from '@vercel/blob'
import { saveFileLocally } from '@/lib/local-storage'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

const hasVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN

// DOAR imagini - fără video
const acceptedTypes = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'
]

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('images') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Nu au fost selectate fișiere' }, { status: 400 })
    }

    // Get current max order
    const maxOrderSlide = await db.heroSlide.findFirst({
      orderBy: { order: 'desc' }
    })
    let currentOrder = maxOrderSlide?.order ?? 0

    const uploadedSlides = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validare - DOAR imagini
      if (!acceptedTypes.includes(file.type)) {
        console.log(`Skipping ${file.name} - not an image (${file.type})`)
        continue
      }

      // Max 50MB per image
      if (file.size > 50 * 1024 * 1024) {
        console.log(`Skipping ${file.name} - too large`)
        continue
      }

      try {
        const ext = file.name.split('.').pop()
        const fileName = `hero-${Date.now()}-${i}.${ext}`

        let fileUrl: string

        if (hasVercelBlob) {
          const blob = await put(fileName, file, {
            access: 'public',
            addRandomSuffix: false,
          })
          fileUrl = blob.url
        } else {
          const result = await saveFileLocally(file, fileName)
          fileUrl = result.url
        }

        currentOrder++

        const slide = await db.heroSlide.create({
          data: {
            filename: fileName,
            originalName: file.name,
            url: fileUrl,
            order: currentOrder,
            size: file.size,
            alt: `Hero slide ${currentOrder}`,
          }
        })

        uploadedSlides.push(slide)
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error)
      }
    }

    if (uploadedSlides.length === 0) {
      return NextResponse.json(
        { error: 'Nu s-au putut încărca imaginile. Doar JPG, PNG, WebP sunt acceptate.' },
        { status: 400 }
      )
    }

    return NextResponse.json(uploadedSlides, { status: 201 })
  } catch (error) {
    console.error('Error uploading hero slides:', error)
    return NextResponse.json({ error: 'Eroare la încărcare' }, { status: 500 })
  }
}
