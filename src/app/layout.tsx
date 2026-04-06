// =============================================
// LAYOUT PRINCIPAL (layout.tsx)
// Acest fișier definește structura de bază a ÎNTREGULUI site
// Toate paginile din aplicație sunt "învelite" în acest layout
// Este ca un "schelet" - conține <html> și <body>
// =============================================

// Importăm tipul Metadata din Next.js - ne ajută să definim titlul și descrierea paginii
import type { Metadata } from "next";

// Importăm fonturile Google "Geist" și "Geist Mono" prin Next.js
// Next.js le optimizează automat (le descarcă local, nu de pe Google)
import { Geist, Geist_Mono } from "next/font/google";

// SessionProvider = furnizor de sesiune pentru autentificare (login/logout)
// Permite oricărei pagini din aplicație să știe dacă utilizatorul este logat
import { SessionProvider } from "next-auth/react";

// Importăm stilurile CSS globale - se aplică pe TOATE paginile
import "./globals.css";

// Configurăm fontul "Geist Sans" (font fără serife, modern)
// variable = numele variabilei CSS care va fi disponibilă în CSS (ex: var(--font-geist-sans))
// subsets = ce caractere să includă ("latin" = litere A-Z, cifre, etc.)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configurăm fontul "Geist Mono" (font monospaced - toate literele au aceeași lățime)
// Folosit de obicei pentru cod sau numere
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadata = informații despre pagină care apar în browser și pe Google
// title = ce apare în tab-ul browserului
// description = descrierea care apare pe Google când cineva caută site-ul
export const metadata: Metadata = {
  title: "Banciu Costin - Fotograf",
  description: "Fotografie profesională - Nuntă, Botez, Evenimente",
};

// Funcția principală RootLayout - aceasta este componenta care "învelește" toate paginile
// children = conținutul paginii curente (pagina de acasă, portofoliu, etc.)
// Readonly<{ children: React.ReactNode }> = tipul TypeScript care spune că children este doar pentru citit
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="ro"> = documentul HTML, limba setată pe română
    <html lang="ro">
      {/* <body> = corpul paginii, unde apare tot conținutul vizibil */}
      {/* className = clasele CSS aplicate pe body */}
      {/* geistSans.variable = adaugă variabila CSS pentru fontul sans */}
      {/* geistMono.variable = adaugă variabila CSS pentru fontul mono */}
      {/* antialiased = face textul să arate mai neted pe ecran */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* SessionProvider = "furnizorul" de autentificare */}
        {/* Învelește tot conținutul ca orice pagină să poată verifica dacă userul e logat */}
        <SessionProvider>
          {/* children = aici se afișează pagina curentă (Home, Portofoliu, etc.) */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
