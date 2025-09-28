import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const eventSchema = z.object({
  name: z.string().min(1, 'Numele este obligatoriu').optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Categoria este obligatorie').optional(),
  eventDate: z.string().nullable().optional(),
  location: z.string().optional(),
  isActive: z.boolean().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const event = await db.event.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Evenimentul nu a fost găsit' },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea evenimentului' },
      { status: 500 }
    )
  }
}

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
    const validatedData = eventSchema.parse(body)

    const existingEvent = await db.event.findUnique({
      where: { id }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Evenimentul nu a fost găsit' },
        { status: 404 }
      )
    }

    let slug = existingEvent.slug

    // If name is being updated, generate new slug
    if (validatedData.name && validatedData.name !== existingEvent.name) {
      slug = generateSlug(validatedData.name)

      // Check if new slug already exists (exclude current event)
      const duplicateEvent = await db.event.findFirst({
        where: { 
          slug,
          categoryId: validatedData.categoryId,
          id: { not: id }
        }
      })

      if (duplicateEvent) {
        return NextResponse.json(
          { error: 'Există deja un eveniment cu acest nume în această categorie' },
          { status: 400 }
        )
      }
    }

    // Check if category exists
    if (validatedData.categoryId) {
      const category = await db.category.findUnique({
        where: { id: validatedData.categoryId }
      })

      if (!category) {
        return NextResponse.json(
          { error: 'Categoria selectată nu există' },
          { status: 400 }
        )
      }
    }

    const event = await db.event.update({
      where: { id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.name && { slug }),
        ...(validatedData.description !== undefined && { description: validatedData.description }),
        ...(validatedData.categoryId && { categoryId: validatedData.categoryId }),
        ...(validatedData.eventDate !== undefined && {
          date: validatedData.eventDate ? new Date(validatedData.eventDate) : null
        }),
        ...(validatedData.location !== undefined && { location: validatedData.location }),
        ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive })
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error updating event:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Date invalide', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Eroare la actualizarea evenimentului' },
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

    const event = await db.event.findUnique({
      where: { id },
      include: {
        images: true
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Evenimentul nu a fost găsit' },
        { status: 404 }
      )
    }

    // Check if event has images
    if (event.images.length > 0) {
      return NextResponse.json(
        { error: 'Nu poți șterge un eveniment care conține imagini' },
        { status: 400 }
      )
    }

    await db.event.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Evenimentul a fost șters cu succes' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Eroare la ștergerea evenimentului' },
      { status: 500 }
    )
  }
}