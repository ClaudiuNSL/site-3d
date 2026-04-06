// Importăm funcția "auth" pentru verificarea autentificării
import { auth } from '@/lib/auth'

// Importăm conexiunea la baza de date
import { db } from '@/lib/db'

// Importăm tipurile Next.js pentru cereri și răspunsuri HTTP
import { NextRequest, NextResponse } from 'next/server'

// Importăm Zod pentru validarea datelor
import { z } from 'zod'

// ============================================
// Schema de validare pentru actualizarea unui pachet
// Similar cu schema din route.ts-ul părinte, dar "price" este opțional
// deoarece la actualizare (PUT) nu e obligatoriu să trimiți toate câmpurile
// ============================================
const packageSchema = z.object({
  name: z.string().min(1, 'Numele este obligatoriu'),
  icon: z.string().optional(),
  // Aici "price" este opțional (spre deosebire de POST unde este obligatoriu)
  price: z.number().optional(),
  currency: z.string().optional(),
  tier: z.string().optional(),
  badge: z.string().optional(),
  features: z.any().optional(),
  extras: z.any().optional(),
  notes: z.any().optional(),
  // "order" este inclus aici pentru a permite reordonarea pachetelor
  order: z.number().optional(),
  isActive: z.boolean().optional()
})

// ============================================
// GET /api/admin/packages/[id] - Returnează un singur pachet după ID
// Aceasta este o rută PRIVATĂ (necesită autentificare)
// [id] este un parametru dinamic - se înlocuiește cu ID-ul real al pachetului
// Exemplu: /api/admin/packages/abc123 -> id = "abc123"
// Returnează: un singur pachet în format JSON
// ============================================
export async function GET(
  request: NextRequest,
  // "params" conține parametrii dinamici din URL (în acest caz, "id")
  // Este un Promise deoarece Next.js 15 folosește parametri asincroni
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extragem "id" din parametrii URL-ului
    // "await" pentru că params este un Promise (o promisiune de date viitoare)
    const { id } = await params

    // Verificăm dacă utilizatorul este autentificat
    const session = await auth()

    if (!session) {
      // 401 = Neautorizat (utilizatorul nu este logat)
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    // Căutăm pachetul cu ID-ul specificat în baza de date
    // "findUnique" caută exact un singur rezultat după un câmp unic (ID)
    const pkg = await db.package.findUnique({
      where: { id }
    })

    // Dacă pachetul nu a fost găsit, returnăm eroare 404 = "Not Found"
    if (!pkg) {
      return NextResponse.json(
        { error: 'Pachetul nu a fost găsit' },
        { status: 404 }
      )
    }

    // Trimitem pachetul găsit ca răspuns JSON
    return NextResponse.json(pkg)
  } catch (error) {
    console.error('Error fetching package:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea pachetului' },
      { status: 500 }
    )
  }
}

// ============================================
// PUT /api/admin/packages/[id] - Actualizează (modifică) un pachet existent
// Aceasta este o rută PRIVATĂ (necesită autentificare)
// Metoda HTTP: PUT (pentru că actualizăm o resursă existentă)
// Exemplu: PUT /api/admin/packages/abc123 cu body-ul { name: "Nou", price: 999 }
// Returnează: pachetul actualizat în format JSON
// ============================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extragem ID-ul din URL
    const { id } = await params

    // Verificăm autentificarea
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    // Citim datele noi trimise în body-ul cererii
    const body = await request.json()

    // Validăm datele cu schema Zod
    const validatedData = packageSchema.parse(body)

    // Mai întâi verificăm dacă pachetul există în baza de date
    // Este important să verificăm înainte de a încerca actualizarea
    const existingPackage = await db.package.findUnique({
      where: { id }
    })

    // Dacă pachetul nu există, returnăm eroare 404
    if (!existingPackage) {
      return NextResponse.json(
        { error: 'Pachetul nu a fost găsit' },
        { status: 404 }
      )
    }

    // Actualizăm pachetul în baza de date cu datele noi validate
    // "update" modifică o înregistrare existentă
    // "where: { id }" specifică CARE pachet să fie actualizat
    // "data: { ... }" conține noile valori pentru câmpuri
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

    // Trimitem pachetul actualizat ca răspuns
    return NextResponse.json(pkg)
  } catch (error) {
    console.error('Error updating package:', error)

    // Dacă eroarea este de validare Zod, returnăm detaliile
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

// ============================================
// DELETE /api/admin/packages/[id] - Șterge un pachet din baza de date
// Aceasta este o rută PRIVATĂ (necesită autentificare)
// Metoda HTTP: DELETE (pentru că ștergem o resursă)
// ATENȚIE: Ștergerea este permanentă! Pachetul nu poate fi recuperat
// Returnează: un mesaj de confirmare
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extragem ID-ul pachetului din URL
    const { id } = await params

    // Verificăm autentificarea
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    // Verificăm dacă pachetul există înainte de a încerca ștergerea
    const pkg = await db.package.findUnique({
      where: { id }
    })

    // Dacă pachetul nu există, returnăm eroare 404
    if (!pkg) {
      return NextResponse.json(
        { error: 'Pachetul nu a fost găsit' },
        { status: 404 }
      )
    }

    // Ștergem pachetul din baza de date
    // "delete" elimină permanent înregistrarea
    await db.package.delete({
      where: { id }
    })

    // Trimitem un mesaj de confirmare că ștergerea a reușit
    return NextResponse.json({ message: 'Pachetul a fost șters cu succes' })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json(
      { error: 'Eroare la ștergerea pachetului' },
      { status: 500 }
    )
  }
}
