// ============================================
// FIȘIER: db.ts - Conexiunea la Baza de Date
// ============================================
// Acest fișier creează și gestionează conexiunea la baza de date.
// Folosim Prisma, o bibliotecă (library) care ne ajută să comunicăm
// cu baza de date fără să scriem SQL manual.
// ============================================

// Importăm PrismaClient - aceasta este clasa care ne permite să facem
// operații în baza de date (citire, scriere, ștergere, actualizare)
import { PrismaClient } from '@prisma/client'

// Creăm o variabilă globală pentru conexiunea la baza de date.
// "globalThis" este un obiect special care există în tot programul.
// Îl folosim ca să stocăm conexiunea Prisma într-un loc accesibil de oriunde.
// "as unknown as { ... }" este o conversie de tip (type casting) -
// îi spunem TypeScript-ului să trateze globalThis ca un obiect care are o proprietate "prisma".
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined // "| undefined" înseamnă că poate fi și nedefinit (gol)
}

// Creăm conexiunea la baza de date și o exportăm ca să o putem folosi în alte fișiere.
// "??" se numește "nullish coalescing operator" - înseamnă:
//   - Dacă globalForPrisma.prisma EXISTĂ deja, folosește-o pe aceea
//   - Dacă NU există, creează una nouă cu "new PrismaClient()"
// Astfel evităm să creăm mai multe conexiuni inutile.
export const db = globalForPrisma.prisma ?? new PrismaClient()

// În modul de dezvoltare (development), salvăm conexiunea în variabila globală.
// Facem asta pentru că Next.js reîncarcă fișierele frecvent în dezvoltare,
// și fără această linie, ar crea o conexiune nouă la fiecare reîncărcare.
// În producție (production) nu avem nevoie de asta.
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
