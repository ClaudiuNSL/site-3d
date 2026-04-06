// ============================================
// FIȘIER: auth.ts - Exportul Funcțiilor de Autentificare
// ============================================
// Acest fișier configurează sistemul de autentificare (login/logout)
// folosind NextAuth, o bibliotecă populară pentru autentificare în Next.js.
// El exportă funcțiile pe care le folosim în restul aplicației
// pentru a gestiona sesiunile utilizatorilor.
// ============================================

// Importăm NextAuth - biblioteca principală care gestionează autentificarea
// (cine este logat, cine nu, sesiuni, etc.)
import NextAuth from "next-auth"

// Importăm configurarea noastră de autentificare din fișierul auth.config.ts
// Acolo definim CUM se face autentificarea (cu email și parolă)
import authConfig from "../auth.config"

// Apelăm NextAuth cu configurarea noastră și extragem 4 funcții importante:
//
// - handlers: Funcțiile care gestionează cererile HTTP de login/logout
//             (le folosim în rutele API)
//
// - signIn: Funcția care autentifică un utilizator (îl loghează)
//
// - signOut: Funcția care deconectează un utilizator (îl deloghează)
//
// - auth: Funcția care verifică dacă un utilizator este autentificat
//         și returnează informațiile despre sesiunea curentă
//
// "export const { ... } = ..." se numește "destructuring" -
// extragem mai multe valori dintr-un obiect și le facem disponibile
// pentru alte fișiere care importă din acest fișier.
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
