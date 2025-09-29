import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const eventSchema = z.object({
  name: z.string().min(1, 'Numele este obligatoriu'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Categoria este obligatorie'),
  date: z.string().nullable().optional(),
  location: z.string().optional(),
  isActive: z.boolean().optional().default(true)
})

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const events = await db.event.findMany({
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: [
        { category: { order: 'asc' } },
        { date: 'desc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea evenimentelor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = eventSchema.parse(body)

    // Check if category exists
    const category = await db.category.findUnique({
      where: { id: validatedData.categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria selectată nu există' },
        { status: 400 }
      )
    }

    const slug = generateSlug(validatedData.name)

    // Check if slug already exists in this category
    const existingEvent = await db.event.findFirst({
      where: { 
        slug,
        categoryId: validatedData.categoryId
      }
    })

    if (existingEvent) {
      return NextResponse.json(
        { error: 'Există deja un eveniment cu acest nume' },
        { status: 400 }
      )
    }

    const event = await db.event.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        categoryId: validatedData.categoryId,
        date: validatedData.date ? new Date(validatedData.date) : null,
        location: validatedData.location,
        isActive: validatedData.isActive
      },
      include: {
        category: true,
        images: true
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Date invalide', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Eroare la crearea evenimentului' },
      { status: 500 }
    )
  }
}