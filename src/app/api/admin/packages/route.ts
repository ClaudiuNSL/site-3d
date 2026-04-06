import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const packageSchema = z.object({
  name: z.string().min(1, 'Numele este obligatoriu'),
  icon: z.string().optional(),
  price: z.number(),
  currency: z.string().optional(),
  tier: z.string().optional(),
  badge: z.string().optional(),
  features: z.any().optional(),
  extras: z.any().optional(),
  notes: z.any().optional(),
  isActive: z.boolean().optional()
})

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const packages = await db.package.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(packages)
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea pachetelor' },
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
    const validatedData = packageSchema.parse(body)

    // Get the next order value
    const lastPackage = await db.package.findFirst({
      orderBy: { order: 'desc' }
    })
    const order = (lastPackage?.order ?? 0) + 1

    const pkg = await db.package.create({
      data: {
        name: validatedData.name,
        icon: validatedData.icon,
        price: validatedData.price,
        currency: validatedData.currency,
        tier: validatedData.tier,
        badge: validatedData.badge,
        features: validatedData.features,
        extras: validatedData.extras,
        notes: validatedData.notes,
        isActive: validatedData.isActive,
        order
      }
    })

    return NextResponse.json(pkg, { status: 201 })
  } catch (error) {
    console.error('Error creating package:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Date invalide', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Eroare la crearea pachetului' },
      { status: 500 }
    )
  }
}
