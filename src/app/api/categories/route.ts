// Importăm conexiunea la baza de date (Prisma ORM)
import { db } from '@/lib/db'

// Importăm NextResponse pentru a trimite răspunsuri HTTP înapoi la browser
import { NextResponse } from 'next/server'

// ============================================
// GET /api/categories - Returnează toate categoriile active cu evenimentele și imaginile lor
// Aceasta este o rută PUBLICĂ (nu necesită autentificare)
// Oricine vizitează site-ul poate vedea categoriile din portofoliu
// Returnează: o listă de categorii, fiecare conținând evenimentele și imaginile sale
// Aceasta este o interogare "nested" (imbricată) - aduce date din 3 tabele simultan:
//   Categorii -> Evenimente -> Imagini
// ============================================
export async function GET() {
  try {
    // Căutăm toate categoriile active din baza de date
    // Aceasta este o interogare mai complexă deoarece include și date relaționate
    const categories = await db.category.findMany({
      // Filtrăm doar categoriile active
      where: {
        isActive: true
      },
      // "include" = includem date din tabelele relaționate (asociate)
      // Este ca și cum ai spune: "adu-mi categoriile, dar include și evenimentele din ele"
      include: {
        // Pentru fiecare categorie, includem evenimentele asociate
        events: {
          // Filtrăm doar evenimentele active
          where: {
            isActive: true
          },
          // Pentru fiecare eveniment, includem și imaginile asociate
          include: {
            images: {
              // Filtrăm doar imaginile active
              where: {
                isActive: true
              },
              // Sortăm imaginile după ordinea lor (câmpul "order")
              orderBy: {
                order: 'asc'
              }
            }
          },
          // Sortăm evenimentele după ordinea lor
          orderBy: {
            order: 'asc'
          }
        }
      },
      // Sortăm categoriile după ordinea lor
      orderBy: {
        order: 'asc'
      }
    })

    // Trimitem categoriile (cu evenimentele și imaginile lor) ca răspuns JSON
    return NextResponse.json(categories)
  } catch (error) {
    // Dacă apare o eroare, o afișăm în consolă pentru debugging
    console.error('Error fetching categories:', error)

    // Răspundem cu eroare 500 (Internal Server Error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
