import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const packageSchema = z.object({
  name: z.string().min(1, 'Numele este obligatoriu'),
  icon: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
  tier: z.string().optional(),
  badge: z.string().optional(),
  features: z.any().optional(),
  extras: z.any().optional(),
  notes: z.any().optional(),
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

    const pkg = await db.package.findUnique({
      where: { id }
    })

    if (!pkg) {
      return NextResponse.json(
        { error: 'Pachetul nu a fost găsit' },
        { status: 404 }
      )
    }

    return NextResponse.json(pkg)
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea pachetului' },
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
    const validatedData = packageSchema.parse(body)

    const existingPackage = await db.package.findUnique({
      where: { id }
    })

    if (!existingPackage) {
      return NextResponse.json(
        { error: 'Pachetul nu a fost găsit' },
        { status: 404 }
      )
    }

    const pkg = await db.package.update({
      where: { id },
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
        order: validatedData.order,
        isActive: validatedData.isActive
      }
    })

    return NextResponse.json(pkg)
  } catch (error) {
    console.error('Error updating package:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Date invalide', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Eroare la actualizarea pachetului' },
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

    const pkg = await db.package.findUnique({
      where: { id }
    })

    if (!pkg) {
      return NextResponse.json(
        { error: 'Pachetul nu a fost găsit' },
        { status: 404 }
      )
    }

    await db.package.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Pachetul a fost șters cu succes' })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json(
      { error: 'Eroare la ștergerea pachetului' },
      { status: 500 }
    )
  }
}
