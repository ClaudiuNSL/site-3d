import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { del } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const hasVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const slide = await db.heroSlide.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.subtitle !== undefined && { subtitle: body.subtitle }),
        ...(body.alt !== undefined && { alt: body.alt }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      }
    })

    return NextResponse.json(slide)
  } catch (error) {
    console.error('Error updating hero slide:', error)
    return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const { id } = await params
    const slide = await db.heroSlide.findUnique({ where: { id } })

    if (!slide) {
      return NextResponse.json({ error: 'Slide-ul nu a fost găsit' }, { status: 404 })
    }

    // Delete file from storage
    try {
      if (hasVercelBlob && slide.url.includes('blob.vercel-storage.com')) {
        await del(slide.url)
      } else {
        const localPath = path.join(process.cwd(), 'public', slide.url)
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath)
        }
      }
    } catch (err) {
      console.error('Error deleting file:', err)
    }

    await db.heroSlide.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting hero slide:', error)
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 })
  }
}
