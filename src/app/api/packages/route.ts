// Importăm conexiunea la baza de date din fișierul nostru de configurare
// "db" este obiectul prin care comunicăm cu baza de date (Prisma ORM)
import { db } from '@/lib/db'

// Importăm NextResponse din Next.js - acesta ne ajută să trimitem răspunsuri HTTP
// (adică să răspundem browserului cu date JSON, coduri de eroare, etc.)
import { NextResponse } from 'next/server'

// ============================================
// GET /api/packages - Returnează toate pachetele active
// Aceasta este o rută PUBLICĂ (nu necesită autentificare)
// Oricine vizitează site-ul poate vedea pachetele
// Returnează: o listă (array) de pachete în format JSON
// ============================================
export async function GET() {
  // "try/catch" este un mecanism de protecție contra erorilor
  // Codul din "try" se execută, iar dacă apare o eroare, se execută codul din "catch"
  try {
    // Căutăm în baza de date toate pachetele care sunt active (isActive: true)
    // "findMany" înseamnă "găsește mai multe" - returnează o listă de rezultate
    // "await" înseamnă "așteaptă" - așteptăm răspunsul de la baza de date
    const packages = await db.package.findMany({
      // "where" = filtrare - selectăm doar pachetele care au isActive setat pe true
      // Pachetele inactive (dezactivate din admin) nu vor fi afișate pe site
      where: {
        isActive: true
      },
      // "orderBy" = sortare - ordonăm pachetele după câmpul "order"
      // "asc" vine de la "ascending" = ordine crescătoare (1, 2, 3, ...)
      orderBy: {
        order: 'asc'
      }
    })

    // Trimitem pachetele găsite înapoi ca răspuns JSON
    // Browserul sau frontend-ul va primi aceste date și le va afișa
    return NextResponse.json(packages)
  } catch (error) {
    // Dacă apare orice eroare (ex: baza de date nu răspunde), ajungem aici
    // Afișăm eroarea în consolă (terminal) pentru debugging
    console.error('Error fetching packages:', error)

    // Trimitem un răspuns de eroare cu status 500
    // Status 500 = "Internal Server Error" (eroare pe server)
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    )
  }
}
