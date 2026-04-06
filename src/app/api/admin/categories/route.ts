// Importăm funcția "auth" pentru verificarea autentificării utilizatorului
import { auth } from '@/lib/auth'

// Importăm conexiunea la baza de date
import { db } from '@/lib/db'

// Importăm funcția "generateSlug" care transformă un nume într-un slug URL-friendly
// Exemplu: "Nuntă Elegant" -> "nunta-elegant" (fără diacritice, cu cratimă în loc de spațiu)
import { generateSlug } from '@/lib/utils'

// Importăm tipurile Next.js pentru cereri și răspunsuri
import { NextRequest, NextResponse } from 'next/server'

// Importăm Zod pentru validarea datelor
import { z } from 'zod'

// ============================================
// Schema de validare pentru o categorie
// Definește regulile pe care datele unei categorii trebuie să le respecte
// ============================================
const categorySchema = z.object({
  // Numele categoriei - obligatoriu, minim 1 caracter
  name: z.string().min(1, 'Numele este obligatoriu'),
  // Descrierea categoriei - opțională
  description: z.string().optional(),
  // Ordinea de afișare - opțională (dacă lipsește, se calculează automat)
  order: z.number().optional()
})

// ============================================
// GET /api/admin/categories - Returnează TOATE categoriile (inclusiv cele inactive)
// Aceasta este o rută PRIVATĂ (necesită autentificare - doar admin-ul)
// Include și numărul de imagini pentru fiecare eveniment (util în dashboard)
// Returnează: o listă de categorii cu evenimentele și numărul de imagini
// ============================================
export async function GET() {
  try {
    // Verificăm dacă utilizatorul este logat
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    // Aducem toate categoriile din baza de date, sortate după ordine
    const categories = await db.category.findMany({
      // Sortăm categoriile crescător după câmpul "order"
      orderBy: { order: 'asc' },
      // Includem datele relaționate (evenimentele din fiecare categorie)
      include: {
        events: {
          include: {
            // "_count" este o funcție specială Prisma care numără relațiile
            // În loc să aducem toate imaginile, numărăm doar câte sunt
            // Acest lucru este mai eficient (mai rapid) decât să aducem toate imaginile
            _count: {
              select: { images: true }
            }
          }
        }
      },
    })

    // Trimitem categoriile ca răspuns JSON
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea categoriilor' },
      { status: 500 }
    )
  }
}

// ============================================
// POST /api/admin/categories - Creează o categorie nouă
// Aceasta este o rută PRIVATĂ (necesită autentificare)
// Metoda HTTP: POST (creăm o resursă nouă)
// Generează automat un "slug" din numele categoriei
// Returnează: categoria nou creată cu status 201 (Created)
// ============================================
export async function POST(request: NextRequest) {
  try {
    // Verificăm autentificarea
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    // Citim datele trimise în cererea POST
    const body = await request.json()

    // Validăm datele cu schema Zod
    const validatedData = categorySchema.parse(body)

    // Generăm un slug din numele categoriei
    // Slug-ul este folosit în URL-uri: /portofoliu/nunta-elegant
    const slug = generateSlug(validatedData.name)

    // Verificăm dacă există deja o categorie cu același slug
    // Slug-urile trebuie să fie unice (nu pot exista două categorii cu același URL)
    const existingCategory = await db.category.findUnique({
      where: { slug }
    })

    // Dacă deja există o categorie cu acest slug, returnăm eroare
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Există deja o categorie cu acest nume' },
        { status: 400 }
      )
    }

    // Calculăm ordinea pentru noua categorie
    // Căutăm categoria cu cea mai mare ordine (ultima)
    const lastCategory = await db.category.findFirst({
      orderBy: { order: 'desc' }
    })

    // Dacă utilizatorul a specificat o ordine, o folosim pe aceea
    // Altfel, luăm ordinea ultimei categorii + 1
    // "??" = dacă valoarea din stânga este null/undefined, folosim valoarea din dreapta
    const order = validatedData.order ?? (lastCategory?.order ?? 0) + 1

    // Creăm categoria nouă în baza de date
    const category = await db.category.create({
      data: {
        name: validatedData.name,
        // Slug-ul generat automat din nume
        slug,
        description: validatedData.description,
        // Ordinea calculată mai sus
        order
      }
    })

    // Trimitem categoria creată cu status 201 = "Created"
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)

    // Dacă eroarea este de validare Zod, returnăm detaliile
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
