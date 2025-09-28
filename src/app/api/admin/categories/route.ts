import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const categorySchema = z.object({
  name: z.string().min(1, 'Numele este obligatoriu'),
  description: z.string().optional(),
  order: z.number().optional()
})

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const categories = await db.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        events: {
          include: {
            _count: {
              select: { images: true }
            }
          }
        }
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea categoriilor' },
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
    const validatedData = categorySchema.parse(body)

    const slug = generateSlug(validatedData.name)

    // Check if slug already exists
    const existingCategory = await db.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Există deja o categorie cu acest nume' },
        { status: 400 }
      )
    }

    // Get the next order value
    const lastCategory = await db.category.findFirst({
      orderBy: { order: 'desc' }
    })
    const order = validatedData.order ?? (lastCategory?.order ?? 0) + 1

    const category = await db.category.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        order
      }
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Date invalide', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Eroare la crearea categoriei' },
      { status: 500 }
    )
  }
}