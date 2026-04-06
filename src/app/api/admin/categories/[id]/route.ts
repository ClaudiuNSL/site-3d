// Importăm funcția "auth" pentru verificarea autentificării
import { auth } from '@/lib/auth'

// Importăm conexiunea la baza de date
import { db } from '@/lib/db'

// Importăm funcția care generează un slug din text
// Slug = versiune URL-friendly a unui text (ex: "Nuntă Elegant" -> "nunta-elegant")
import { generateSlug } from '@/lib/utils'

// Importăm tipurile Next.js
import { NextRequest, NextResponse } from 'next/server'

// Importăm Zod pentru validarea datelor
import { z } from 'zod'

// ============================================
// Schema de validare pentru actualizarea unei categorii
// Include și câmpul "isActive" față de schema de creare
// ============================================
const categorySchema = z.object({
  // Numele categoriei - obligatoriu, minim 1 caracter
  name: z.string().min(1, 'Numele este obligatoriu'),
  // Descrierea categoriei - opțională
  description: z.string().optional(),
  // Ordinea de afișare - opțională
  order: z.number().optional(),
  // Dacă categoria este activă sau nu - opțional (true/false)
  isActive: z.boolean().optional()
})

// ============================================
// GET /api/admin/categories/[id] - Returnează o singură categorie după ID
// Aceasta este o rută PRIVATĂ (necesită autentificare)
// [id] este un parametru dinamic din URL
// Include evenimentele și imaginile asociate categoriei
// Returnează: categoria cu toate datele sale relaționate
// ============================================
export async function GET(
  request: NextRequest,
  // "params" conține parametrii dinamici din URL (aici, "id")
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extragem ID-ul din parametrii URL-ului
    const { id } = await params

    // Verificăm autentificarea
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    // Căutăm categoria cu ID-ul specificat
    // "findUnique" caută exact o singură înregistrare după un câmp unic
    const category = await db.category.findUnique({
      where: { id },
      // Includem datele relaționate: evenimentele și imaginile lor
      include: {
        events: {
          include: {
            // Includem toate imaginile fiecărui eveniment
            images: true
          }
        }
      }
    })

    // Dacă categoria nu a fost găsită, returnăm eroare 404 = "Not Found"
    if (!category) {
      return NextResponse.json(
        { error: 'Categoria nu a fost găsită' },
        { status: 404 }
      )
    }

    // Trimitem categoria găsită ca răspuns JSON
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea categoriei' },
      { status: 500 }
    )
  }
}

// ============================================
// PUT /api/admin/categories/[id] - Actualizează o categorie existentă
// Aceasta este o rută PRIVATĂ (necesită autentificare)
// Metoda HTTP: PUT (actualizăm o resursă existentă)
// Regenerează slug-ul dacă numele se schimbă și verifică unicitatea
// Returnează: categoria actualizată în format JSON
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

    // Citim datele noi din body-ul cererii
    const body = await request.json()

    // Validăm datele cu schema Zod
    const validatedData = categorySchema.parse(body)

    // Verificăm dacă categoria există în baza de date
    const existingCategory = await db.category.findUnique({
      where: { id }
    })

    // Dacă categoria nu există, returnăm eroare 404
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Categoria nu a fost găsită' },
        { status: 404 }
      )
    }

    // Generăm un nou slug din noul nume
    const slug = generateSlug(validatedData.name)

    // Verificăm dacă slug-ul s-a schimbat (dacă numele s-a schimbat)
    // Dacă slug-ul este diferit de cel existent, trebuie să verificăm unicitatea
    if (slug !== existingCategory.slug) {
      // Căutăm dacă altă categorie are deja acest slug
      const duplicateCategory = await db.category.findUnique({
        where: { slug }
      })

      // Dacă există deja o categorie cu acest slug, returnăm eroare
      // Nu putem avea două categorii cu același URL
      if (duplicateCategory) {
        return NextResponse.json(
          { error: 'Există deja o categorie cu acest nume' },
          { status: 400 }
        )
      }
    }

    // Actualizăm categoria în baza de date cu datele noi
    const category = await db.category.update({
      where: { id },
      data: {
        name: validatedData.name,
        // Slug-ul regenerat (poate fi același dacă numele nu s-a schimbat)
        slug,
        description: validatedData.description,
        order: validatedData.order,
        isActive: validatedData.isActive
      }
    })

    // Trimitem categoria actualizată ca răspuns
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)

    // Dacă eroarea este de validare Zod, returnăm detaliile
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

// ============================================
// DELETE /api/admin/categories/[id] - Șterge o categorie din baza de date
// Aceasta este o rută PRIVATĂ (necesită autentificare)
// Metoda HTTP: DELETE (ștergem o resursă)
// PROTECȚIE: Nu permite ștergerea dacă categoria conține evenimente
// Aceasta previne pierderea accidentală a datelor
// Returnează: un mesaj de confirmare
// ============================================
export async function DELETE(
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

    // Căutăm categoria și includem evenimentele ei
    // Avem nevoie de evenimente pentru a verifica dacă categoria poate fi ștearsă
    const category = await db.category.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            // Numărăm imaginile fiecărui eveniment (pentru informare)
            _count: { select: { images: true } }
          }
        }
      }
    })

    // Dacă categoria nu există, returnăm eroare 404
    if (!category) {
      return NextResponse.json(
        { error: 'Categoria nu a fost găsită' },
        { status: 404 }
      )
    }

    // PROTECȚIE: Verificăm dacă categoria conține evenimente
    // Dacă are evenimente, NU permitem ștergerea
    // Utilizatorul trebuie mai întâi să șteargă evenimentele din categorie
    // Aceasta previne ștergerea accidentală a multor date
    if (category.events.length > 0) {
      return NextResponse.json(
        { error: 'Nu poți șterge o categorie care conține evenimente' },
        { status: 400 }
      )
    }

    // Dacă categoria nu are evenimente, o putem șterge în siguranță
    await db.category.delete({
      where: { id }
    })

    // Confirmăm ștergerea cu un mesaj de succes
    return NextResponse.json({ message: 'Categoria a fost ștearsă cu succes' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Eroare la ștergerea categoriei' },
      { status: 500 }
    )
  }
}
