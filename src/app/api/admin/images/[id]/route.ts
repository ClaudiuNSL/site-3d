import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { del } from '@vercel/blob'
import { deleteFileLocally } from '@/lib/local-storage'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const updateImageSchema = z.object({
  order: z.number().optional(),
  altText: z.string().optional()
})

// Verifică dacă avem token Vercel Blob
const hasVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateImageSchema.parse(body)

    const image = await db.image.findUnique({
      where: { id }
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Imaginea nu a fost găsită' },
        { status: 404 }
      )
    }

    const updatedImage = await db.image.update({
      where: { id },
      data: {
        ...(validatedData.order !== undefined && { order: validatedData.order }),
        ...(validatedData.altText !== undefined && { altText: validatedData.altText })
      }
    })

    return NextResponse.json(updatedImage)
  } catch (error) {
    console.error('Error updating image:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Date invalide', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Eroare la actualizarea imaginii' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const image = await db.image.findUnique({
      where: { id }
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Imaginea nu a fost găsită' },
        { status: 404 }
      )
    }

    try {
      // Șterge din storage (Vercel Blob sau Local)
      if (hasVercelBlob) {
        await del(image.url)
      } else {
        // Șterge local
        await deleteFileLocally(image.filename)
      }
    } catch (storageError) {
      console.error('Error deleting from storage:', storageError)
      // Continuă cu ștergerea din baza de date chiar dacă ștergerea din storage eșuează
    }

    // Șterge din baza de date
    await db.image.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Imaginea a fost ștearsă cu succes' })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Eroare la ștergerea imaginii' },
      { status: 500 }
    )
  }
}