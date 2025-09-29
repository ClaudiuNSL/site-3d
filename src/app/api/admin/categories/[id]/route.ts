import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1, 'Numele este obligatoriu'),
  description: z.string().optional(),
  order: z.number().optional(),
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

    const category = await db.category.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            images: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria nu a fost găsită' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea categoriei' },
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
    const validatedData = categorySchema.parse(body)

    const existingCategory = await db.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Categoria nu a fost găsită' },
        { status: 404 }
      )
    }

    const slug = generateSlug(validatedData.name)

    // Check if slug already exists (exclude current category)
    if (slug !== existingCategory.slug) {
      const duplicateCategory = await db.category.findUnique({
        where: { slug }
      })

      if (duplicateCategory) {
        return NextResponse.json(
          { error: 'Există deja o categorie cu acest nume' },
          { status: 400 }
        )
      }
    }

    const category = await db.category.update({
      where: { id },
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        order: validatedData.order,
        isActive: validatedData.isActive
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Date invalide', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Eroare la actualizarea categoriei' },
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

    const category = await db.category.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            _count: { select: { images: true } }
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria nu a fost găsită' },
        { status: 404 }
      )
    }

    // Check if category has events
    if (category.events.length > 0) {
      return NextResponse.json(
        { error: 'Nu poți șterge o categorie care conține evenimente' },
        { status: 400 }
      )
    }

    await db.category.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Categoria a fost ștearsă cu succes' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Eroare la ștergerea categoriei' },
      { status: 500 }
    )
  }
}