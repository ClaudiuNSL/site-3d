import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { del } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const updateImageSchema = z.object({
  order: z.number().optional(),
  altText: z.string().optional()
})

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
      // Delete from Vercel Blob storage
      await del(image.url)
    } catch (blobError) {
      console.error('Error deleting from blob storage:', blobError)
      // Continue with database deletion even if blob deletion fails
    }

    // Delete from database
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