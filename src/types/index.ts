// ============================================
// FIȘIER: types/index.ts - Definițiile de Tipuri (Type Definitions)
// ============================================
// Acest fișier definește "interfețe" (interfaces) - structuri care descriu
// cum arată datele noastre. Gândește-te la ele ca la niște "schițe" sau "planuri"
// care spun TypeScript-ului ce proprietăți are fiecare obiect.
//
// De exemplu, interfața "User" spune: un utilizator are un id, email, nume și rol.
// Dacă încerci să creezi un User fără email, TypeScript va da eroare.
//
// "export" înseamnă că aceste tipuri pot fi folosite în alte fișiere.
// "interface" definește structura unui obiect (ce proprietăți are și de ce tip sunt).
// "?" după numele unei proprietăți înseamnă că este opțională (poate lipsi).
// "| null" înseamnă că valoarea poate fi și null (goală/inexistentă).
// ============================================

// ============================================
// Interfața "User" - Structura unui Utilizator
// ============================================
// Descrie cum arată un utilizator în aplicația noastră.
export interface User {
  id: string          // ID-ul unic al utilizatorului (text)
  email: string       // Adresa de email (obligatorie)
  name?: string | null // Numele utilizatorului (opțional - poate lipsi sau fi null)
  role: string        // Rolul utilizatorului (ex: "admin", "user")
}

// ============================================
// Interfața "Category" - Structura unei Categorii
// ============================================
// O categorie grupează mai multe evenimente (ex: "Nunți", "Botezuri", "Corporate").
export interface Category {
  id: string              // ID-ul unic al categoriei
  name: string            // Numele categoriei (ex: "Nunți")
  slug: string            // Versiunea URL-friendly a numelui (ex: "nunti")
  subtitle?: string | null // Subtitlul categoriei (opțional)
  icon?: string | null    // Iconița categoriei (opțional, ex: "💒")
  description?: string | null // Descrierea detaliată a categoriei (opțional)
  order: number           // Ordinea de afișare (1, 2, 3...) - pentru sortare
  isActive: boolean       // Dacă categoria este activă (vizibilă) sau nu
  createdAt: Date         // Data și ora la care a fost creată categoria
  updatedAt: Date         // Data și ora ultimei actualizări
  events?: Event[]        // Lista de evenimente din această categorie (opțional)
                          // "Event[]" înseamnă un array (listă) de obiecte Event
}

// ============================================
// Interfața "Event" - Structura unui Eveniment
// ============================================
// Un eveniment este o lucrare/proiect din portofoliu (ex: "Nunta Maria & Andrei").
export interface Event {
  id: string               // ID-ul unic al evenimentului
  name: string             // Numele evenimentului (ex: "Nunta Maria & Andrei")
  slug: string             // Versiunea URL-friendly a numelui
  description?: string | null // Descrierea evenimentului (opțional)
  date?: Date | null       // Data evenimentului (opțional)
  location?: string | null // Locația evenimentului (opțional, ex: "București")
  isActive: boolean        // Dacă evenimentul este activ (vizibil)
  order: number            // Ordinea de afișare
  createdAt: Date          // Data creării
  updatedAt: Date          // Data ultimei actualizări
  categoryId: string       // ID-ul categoriei din care face parte acest eveniment
                           // Aceasta este o "cheie străină" (foreign key) -
                           // leagă evenimentul de categoria sa
  category?: Category      // Obiectul categoriei asociate (opțional, inclus la nevoie)
  images?: Image[]         // Lista de imagini ale evenimentului (opțional)
}

// ============================================
// Interfața "Image" - Structura unei Imagini/Video
// ============================================
// Reprezintă un fișier media (imagine sau video) asociat unui eveniment.
export interface Image {
  id: string                  // ID-ul unic al imaginii
  filename: string            // Numele fișierului pe server (ex: "abc123.jpg")
  originalName?: string | null // Numele original al fișierului încărcat de utilizator
  url: string                 // Adresa URL unde este stocată imaginea
  thumbnailUrl?: string | null // Adresa URL a versiunii mici (thumbnail) a imaginii
  alt?: string | null         // Textul alternativ - descrie imaginea pentru accesibilitate
                              // și pentru motoarele de căutare (SEO)
  width?: number | null       // Lățimea imaginii în pixeli (opțional)
  height?: number | null      // Înălțimea imaginii în pixeli (opțional)
  size?: number | null        // Dimensiunea fișierului în bytes (opțional)
  mimeType?: string | null    // Tipul fișierului (image/jpeg, video/mp4, etc.)
  duration?: number | null    // Durata video-ului în secunde (doar pentru videouri)
  order: number               // Ordinea de afișare în galerie
  isActive: boolean           // Dacă imaginea este activă (vizibilă)
  createdAt: Date             // Data încărcării
  updatedAt: Date             // Data ultimei actualizări
  eventId: string             // ID-ul evenimentului căruia îi aparține imaginea
                              // (cheie străină - foreign key)
  event?: Event               // Obiectul evenimentului asociat (opțional)
}

// ============================================
// Interfața "ShowreelVideo" - Structura unui Video Showreel
// ============================================
// Un showreel este un video demonstrativ care prezintă cele mai bune lucrări.
export interface ShowreelVideo {
  id: string                    // ID-ul unic al video-ului
  title: string                 // Titlul video-ului
  subtitle?: string | null      // Subtitlul video-ului (opțional)
  videoUrl: string              // Adresa URL a video-ului
  thumbnailUrl?: string | null  // Adresa URL a imaginii de previzualizare (thumbnail)
  isActive: boolean             // Dacă video-ul este activ (vizibil)
  createdAt: Date               // Data adăugării
  updatedAt: Date               // Data ultimei actualizări
}

// ============================================
// Interfața "HeroSlide" - Structura unui Slide din Hero
// ============================================
// "Hero" este secțiunea mare de sus a paginii principale.
// Un "slide" este o imagine care se rotește în acea secțiune.
export interface HeroSlide {
  id: string                    // ID-ul unic al slide-ului
  filename: string              // Numele fișierului pe server
  originalName?: string | null  // Numele original al fișierului
  url: string                   // Adresa URL a imaginii
  alt?: string | null           // Textul alternativ pentru accesibilitate
  title?: string | null         // Titlul afișat pe slide (opțional)
  subtitle?: string | null      // Subtitlul afișat pe slide (opțional)
  order: number                 // Ordinea de afișare a slide-urilor
  isActive: boolean             // Dacă slide-ul este activ (vizibil)
  size?: number | null          // Dimensiunea fișierului în bytes
  createdAt: Date               // Data adăugării
  updatedAt: Date               // Data ultimei actualizări
}

// ============================================
// Interfața "PackageFeature" - O Caracteristică a unui Pachet
// ============================================
// Descrie o caracteristică inclusă într-un pachet de servicii.
// Exemplu: { icon: "📸", text: "Fotografiere 8 ore" }
export interface PackageFeature {
  icon: string  // Iconița/emoji-ul asociat caracteristicii
  text: string  // Textul care descrie caracteristica
}

// ============================================
// Interfața "PackageExtra" - Un Extra (Adaos) pentru un Pachet
// ============================================
// Descrie un serviciu extra care poate fi adăugat la un pachet, cu preț separat.
// Exemplu: { text: "Album foto suplimentar", price: "200 RON" }
export interface PackageExtra {
  text: string   // Descrierea extra-ului
  price: string  // Prețul extra-ului (ca text, ex: "200 RON")
}

// ============================================
// Interfața "PackageNote" - O Notă/Observație despre un Pachet
// ============================================
// Descrie o notă sau observație importantă despre un pachet.
// Exemplu: { icon: "ℹ️", text: "Deplasare inclusă în București" }
export interface PackageNote {
  icon: string  // Iconița/emoji-ul asociat notei
  text: string  // Textul notei
}

// ============================================
// Interfața "Package" - Structura unui Pachet de Servicii
// ============================================
// Un pachet de servicii combină mai multe caracteristici la un preț fix.
// Exemplu: Pachet "Gold" - 2000 RON, include fotografiere + videografie.
export interface Package {
  id: string                    // ID-ul unic al pachetului
  name: string                  // Numele pachetului (ex: "Gold", "Premium")
  icon: string                  // Iconița pachetului
  price: number                 // Prețul pachetului (ca număr)
  currency: string              // Moneda (ex: "RON", "EUR")
  tier: string                  // Nivelul pachetului (ex: "basic", "premium", "vip")
  badge?: string | null         // Insigna/eticheta pachetului (opțional, ex: "Cel mai popular")
  features: PackageFeature[]    // Lista de caracteristici incluse în pachet
  extras: PackageExtra[]        // Lista de extra-uri disponibile
  notes: PackageNote[]          // Lista de note/observații
  order: number                 // Ordinea de afișare
  isActive: boolean             // Dacă pachetul este activ (vizibil)
  createdAt: Date               // Data creării
  updatedAt: Date               // Data ultimei actualizări
}

// ============================================
// Extinderea Tipurilor NextAuth (Module Augmentation)
// ============================================
// "declare module" ne permite să EXTINDEM tipurile unei biblioteci externe.
// NextAuth are propriile tipuri pentru Session și User, dar noi vrem să adăugăm
// proprietăți suplimentare (ca "role" și "id").
//
// Fără aceste declarații, TypeScript ar da eroare când accesăm session.user.role
// pentru că nu ar ști că acea proprietate există.
declare module "next-auth" {

  // Extindem interfața Session - adăugăm câmpurile noastre la obiectul "user" din sesiune
  interface Session {
    user: {
      id: string              // ID-ul utilizatorului (adăugat de noi)
      email?: string | null   // Email-ul (din tipul original NextAuth)
      name?: string | null    // Numele (din tipul original NextAuth)
      role: string            // Rolul utilizatorului (adăugat de noi - ex: "admin")
    }
  }

  // Extindem interfața User - adăugăm câmpul "role"
  // Acest lucru permite NextAuth să știe că obiectul User are și un câmp "role"
  interface User {
    role: string  // Rolul utilizatorului (ex: "admin", "user")
  }
}
