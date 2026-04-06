// ============================================
// FIȘIER: auth.config.ts - Configurarea Autentificării
// ============================================
// Acest fișier definește TOATĂ configurarea pentru autentificare:
// - Cum se loghează utilizatorii (cu email și parolă)
// - Ce pagini sunt protejate (doar pentru admini)
// - Cum se stochează informațiile despre sesiune
// ============================================

// Importăm tipul NextAuthConfig - acesta definește structura configurării
// "type" înseamnă că importăm doar definiția de tip, nu cod executabil
import type { NextAuthConfig } from "next-auth"

// Importăm "CredentialsProvider" - un mod de autentificare cu email și parolă
// Există și alți provideri (Google, GitHub, etc.), dar noi folosim credențiale proprii
import CredentialsProvider from "next-auth/providers/credentials"

// Exportăm configurarea ca obiect implicit (default export)
// "satisfies NextAuthConfig" verifică la compilare că obiectul nostru
// respectă structura așteptată de NextAuth
export default {

  // ============================================
  // SECȚIUNEA "providers" - Metodele de Autentificare
  // ============================================
  // Aici definim CUM se pot loga utilizatorii.
  // Folosim un singur provider: autentificare cu email și parolă.
  providers: [
    CredentialsProvider({

      // Definim câmpurile pe care le va trimite formularul de login
      credentials: {
        email: { label: "Email", type: "email" },       // Câmpul pentru adresa de email
        password: { label: "Password", type: "password" } // Câmpul pentru parolă
      },

      // ============================================
      // Funcția "authorize" - Verifică Datele de Login
      // ============================================
      // Această funcție este apelată automat când cineva încearcă să se logheze.
      // Primește credențialele (email + parolă) și verifică dacă sunt corecte.
      // Returnează datele utilizatorului dacă totul e OK, sau null dacă nu.
      // "async" înseamnă că funcția face operații asincrone (așteaptă răspunsuri)
      async authorize(credentials) {

        // Verificăm dacă au fost trimise email-ul și parola
        // "?." se numește "optional chaining" - dacă credentials este null/undefined,
        // nu dă eroare, ci returnează pur și simplu undefined
        if (!credentials?.email || !credentials?.password) {
          return null // Returnăm null = autentificare eșuată
        }

        // Importăm baza de date și biblioteca de verificare a parolelor
        // Le importăm AICI (nu sus) pentru că acest cod poate rula pe Edge Runtime,
        // unde unele biblioteci nu funcționează. Importul dinamic rezolvă problema.
        const { db } = await import("./lib/db")           // Conexiunea la baza de date
        const { compare } = await import("bcryptjs")       // Funcția de comparare a parolelor

        // Căutăm utilizatorul în baza de date după adresa de email
        // "findUnique" returnează UN SINGUR utilizator (sau null dacă nu există)
        // "where" specifică condiția de căutare
        const user = await db.user.findUnique({
          where: { email: credentials.email as string } // "as string" = conversie de tip la string
        })

        // Dacă nu am găsit niciun utilizator cu acest email, autentificarea eșuează
        if (!user) {
          return null
        }

        // Verificăm dacă parola trimisă corespunde cu parola din baza de date.
        // Parolele sunt stocate CRIPTAT (hash) în baza de date pentru securitate.
        // "compare" compară parola în text simplu cu versiunea criptată.
        // "await" - așteptăm rezultatul pentru că operația este asincronă
        const isPasswordValid = await compare(
          credentials.password as string, // Parola trimisă de utilizator (text simplu)
          user.password                    // Parola din baza de date (criptată/hash)
        )

        // Dacă parola nu este corectă, autentificarea eșuează
        if (!isPasswordValid) {
          return null
        }

        // Dacă totul este OK, returnăm datele utilizatorului.
        // Aceste date vor fi stocate în sesiune și token-ul JWT.
        return {
          id: user.id,       // ID-ul unic al utilizatorului
          email: user.email, // Adresa de email
          name: user.name,   // Numele utilizatorului
          role: user.role    // Rolul (ex: "admin", "user")
        }
      }
    })
  ],

  // ============================================
  // SECȚIUNEA "pages" - Paginile Personalizate
  // ============================================
  // Aici spunem NextAuth să folosească paginile noastre personalizate
  // în loc de cele implicite (default).
  pages: {
    signIn: '/admin/login' // Pagina de login este la această adresă URL
  },

  // ============================================
  // SECȚIUNEA "callbacks" - Funcții Apelate Automat
  // ============================================
  // Callback-urile sunt funcții care se execută automat în diferite momente
  // ale procesului de autentificare. Le folosim pentru a personaliza comportamentul.
  callbacks: {

    // ============================================
    // Callback "authorized" - Controlul Accesului la Pagini
    // ============================================
    // Această funcție decide dacă un utilizator are voie să acceseze o anumită pagină.
    // Este apelată la FIECARE navigare în aplicație.
    // Primește: auth (informații sesiune) și request (informații despre cerere/URL)
    authorized({ auth, request: { nextUrl } }) {
      // Verificăm dacă utilizatorul este logat
      // "!!" transformă orice valoare în true sau false
      // Dacă auth?.user există => true, dacă nu => false
      const isLoggedIn = !!auth?.user

      // Verificăm dacă pagina cerută este din secțiunea admin
      // .startsWith('/admin') returnează true dacă URL-ul începe cu "/admin"
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')

      // Dacă utilizatorul încearcă să acceseze o pagină de admin:
      if (isOnAdmin) {
        if (isLoggedIn) return true  // Dacă e logat, îi permitem accesul
        return false                  // Dacă NU e logat, îi interzicem accesul (va fi redirecționat la login)
      }

      // Pentru toate celelalte pagini (non-admin), permitem accesul tuturor
      return true
    },

    // ============================================
    // Callback "jwt" - Personalizarea Token-ului JWT
    // ============================================
    // JWT (JSON Web Token) este un "bilet" digital care dovedește identitatea utilizatorului.
    // Această funcție adaugă informații suplimentare în token.
    // Este apelată de fiecare dată când token-ul este creat sau actualizat.
    jwt({ token, user }) {
      // Dacă avem date despre utilizator (la prima autentificare),
      // adăugăm rolul în token
      if (user) {
        token.role = user.role // Salvăm rolul (ex: "admin") în token
      }
      // Returnăm token-ul (eventual modificat)
      return token
    },

    // ============================================
    // Callback "session" - Personalizarea Sesiunii
    // ============================================
    // Sesiunea este informația despre utilizatorul curent, disponibilă în aplicație.
    // Această funcție transferă date din token în sesiune.
    // Este apelată de fiecare dată când se accesează sesiunea.
    session({ session, token }) {
      // Dacă avem un token valid, adăugăm informații în sesiune
      if (token) {
        session.user.id = token.sub!         // "sub" (subject) este ID-ul utilizatorului din token
                                              // "!" îi spune TypeScript-ului că valoarea sigur există
        session.user.role = token.role as string // Copiem rolul din token în sesiune
      }
      // Returnăm sesiunea (eventual modificată)
      return session
    }
  }
} satisfies NextAuthConfig
