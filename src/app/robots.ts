// Importăm tipul MetadataRoute din Next.js
import type { MetadataRoute } from 'next'

// ============================================================
// ROBOTS.TXT - "Regulile" pentru roboții Google
// ============================================================
// Acest fișier îi spune lui Google (și altor motoare de căutare):
// - Ce pagini are voie să acceseze
// - Ce pagini NU are voie să acceseze (ex: panoul de admin)
// - Unde e sitemap-ul (harta site-ului)
// Fișierul va fi disponibil automat la: https://site-tau.ro/robots.txt

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',          // Se aplică TUTUROR roboților (Google, Bing, etc.)
        allow: '/',              // Permite accesul la pagina principală și tot ce e public
        disallow: [
          '/admin/',             // INTERZICE accesul la panoul de admin
          '/api/',               // INTERZICE accesul la rutele API (nu sunt pagini)
        ],
      },
    ],
    // Spunem unde e sitemap-ul ca Google să-l găsească ușor
    sitemap: 'https://banciucostin.ro/sitemap.xml',
  }
}
