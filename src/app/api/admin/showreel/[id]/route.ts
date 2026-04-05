import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const video = await db.showreelVideo.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error updating showreel:', error)
    return NextResponse.json({ error: 'Eroare la actualizare' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const { id } = await params

    await db.showreelVideo.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting showreel:', error)
    return NextResponse.json({ error: 'Eroare la ștergere' }, { status: 500 })
  }
}
