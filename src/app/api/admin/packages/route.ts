// Importăm funcția "auth" care verifică dacă utilizatorul este autentificat (logat)
import { auth } from '@/lib/auth'

// Importăm conexiunea la baza de date
import { db } from '@/lib/db'

// Importăm NextRequest (pentru a citi cererea) și NextResponse (pentru a trimite răspunsul)
import { NextRequest, NextResponse } from 'next/server'

// Importăm "z" din Zod - o bibliotecă pentru validarea datelor
// Zod ne ajută să verificăm dacă datele primite au formatul corect
// De exemplu: "name" trebuie să fie un string (text), "price" trebuie să fie un număr
import { z } from 'zod'

// ============================================
// Schema de validare pentru un pachet
// Aceasta definește regulile pe care datele trebuie să le respecte
// Dacă cineva trimite date care nu respectă aceste reguli, primește eroare
// ============================================
const packageSchema = z.object({
  // "name" trebuie să fie un string (text) cu minim 1 caracter (nu poate fi gol)
  name: z.string().min(1, 'Numele este obligatoriu'),
  // "icon" este opțional - poate fi un string sau poate lipsi
  icon: z.string().optional(),
  // "price" trebuie să fie un număr (ex: 500, 1200)
  price: z.number(),
  // "currency" este opțional - moneda (ex: "RON", "EUR")
  currency: z.string().optional(),
  // "tier" este opțional - nivelul pachetului (ex: "basic", "premium")
  tier: z.string().optional(),
  // "badge" este opțional - eticheta afișată pe pachet (ex: "Popular", "Best Value")
  badge: z.string().optional(),
  // "features" este opțional - lista de funcționalități/servicii incluse
  // z.any() acceptă orice tip de date (array, obiect, etc.)
  features: z.any().optional(),
  // "extras" este opțional - servicii extra disponibile
  extras: z.any().optional(),
  // "notes" este opțional - note sau observații despre pachet
  notes: z.any().optional(),
  // "isActive" este opțional - dacă pachetul este activ sau nu (true/false)
  isActive: z.boolean().optional()
})

// ============================================
// GET /api/admin/packages - Returnează TOATE pachetele (inclusiv cele inactive)
// Aceasta este o rută PRIVATĂ (necesită autentificare - doar admin-ul)
// Spre deosebire de ruta publică /api/packages, aceasta returnează și pachetele inactive
// Returnează: o listă completă de pachete în format JSON
// ============================================
export async function GET() {
  try {
    // Verificăm dacă utilizatorul este autentificat (logat)
    // "auth()" returnează sesiunea utilizatorului sau null dacă nu e logat
    const session = await auth()

    // Dacă nu există sesiune, înseamnă că utilizatorul nu este logat
    // Returnăm eroare 401 = "Unauthorized" (neautorizat)
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    // Aducem TOATE pachetele din baza de date (fără filtru pe isActive)
    // Le sortăm după câmpul "order" în ordine crescătoare
    const packages = await db.package.findMany({
      orderBy: { order: 'asc' }
    })

    // Trimitem pachetele ca răspuns JSON
    return NextResponse.json(packages)
  } catch (error) {
    // Afișăm eroarea în consolă și trimitem răspuns de eroare
    console.error('Error fetching packages:', error)
    return NextResponse.json(
      { error: 'Eroare la încărcarea pachetelor' },
      { status: 500 }
    )
  }
}

// ============================================
// POST /api/admin/packages - Creează un pachet nou
// Aceasta este o rută PRIVATĂ (necesită autentificare - doar admin-ul)
// Metoda HTTP: POST (pentru că creăm o resursă nouă)
// Returnează: pachetul nou creat cu status 201 (Created)
// ============================================
export async function POST(request: NextRequest) {
  try {
    // Verificăm dacă utilizatorul este autentificat
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    // Citim datele trimise în body-ul cererii POST (datele noului pachet)
    const body = await request.json()

    // Validăm datele folosind schema Zod definită mai sus
    // Dacă datele nu respectă regulile, Zod aruncă o eroare (ZodError)
    // "parse" verifică datele și returnează datele validate
    const validatedData = packageSchema.parse(body)

    // Căutăm ultimul pachet (cu cel mai mare "order") pentru a calcula ordinea noului pachet
    // "findFirst" returnează primul rezultat (sau null dacă nu există)
    // Sortăm descrescător (desc) ca să obținem pachetul cu ordinea cea mai mare
    const lastPackage = await db.package.findFirst({
      orderBy: { order: 'desc' }
    })

    // Calculăm ordinea noului pachet: ordinea ultimului pachet + 1
    // "??" este operatorul "nullish coalescing" - dacă lastPackage?.order este null/undefined, folosim 0
    // Deci dacă nu există niciun pachet, ordinea va fi 0 + 1 = 1
    const order = (lastPackage?.order ?? 0) + 1

    // Creăm pachetul nou în baza de date cu datele validate
    // "create" inserează o nouă înregistrare în tabelul "package"
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
        // Adăugăm ordinea calculată mai sus
        order
      }
    })

    // Trimitem pachetul creat cu status 201 = "Created" (resursa a fost creată cu succes)
    return NextResponse.json(pkg, { status: 201 })
  } catch (error) {
    // Afișăm eroarea în consolă
    console.error('Error creating package:', error)

    // Verificăm dacă eroarea este de tip ZodError (eroare de validare)
    // "instanceof" verifică dacă un obiect este o instanță a unei clase
    if (error instanceof z.ZodError) {
      // Dacă datele sunt invalide, returnăm eroare 400 = "Bad Request"
      // Includem detaliile erorii (ce câmpuri sunt greșite) în "details"
      return NextResponse.json(
        { error: 'Date invalide', details: error.issues },
        { status: 400 }
      )
    }

    // Pentru orice altă eroare, returnăm eroare 500 (eroare internă de server)
    return NextResponse.json(
      { error: 'Eroare la crearea pachetului' },
      { status: 500 }
    )
  }
}
