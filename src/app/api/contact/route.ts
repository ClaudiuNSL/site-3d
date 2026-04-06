// Importăm NextResponse pentru a trimite răspunsuri HTTP
import { NextResponse } from 'next/server'

// Importăm nodemailer - o bibliotecă (library) care ne permite să trimitem email-uri
// din Node.js. Funcționează cu Gmail, Yahoo, Outlook, etc.
import nodemailer from 'nodemailer'

// ============================================
// POST /api/contact - Trimite un email cu datele din formularul de contact
// Aceasta este o rută PUBLICĂ (nu necesită autentificare)
// Vizitatorii site-ului o folosesc pentru a trimite mesaje prin formularul de contact
// Metoda HTTP: POST (pentru că trimitem date noi, nu cerem date existente)
// Returnează: { success: true } dacă emailul a fost trimis cu succes
// ============================================
export async function POST(request: Request) {
  // Verificăm dacă variabilele de mediu (environment variables) pentru Gmail sunt configurate
  // process.env conține variabilele din fișierul .env (user, parolă Gmail)
  // Fără aceste credențiale, nu putem trimite email-uri
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
    // Afișăm eroarea în consolă pentru debugging
    console.error('Gmail credentials not configured')

    // Răspundem cu status 503 = "Service Unavailable" (serviciu indisponibil)
    return NextResponse.json(
      { error: 'Serviciul de email nu este configurat. Te rog contactează-ne direct la costinfoto@gmail.com' },
      { status: 503 }
    )
  }

  try {
    // Extragem datele JSON trimise de formularul de contact din body-ul cererii
    // "request.json()" citește și parsează (transformă) body-ul cererii din JSON în obiect JavaScript
    const body = await request.json()

    // Destructurăm (extragem) câmpurile individuale din obiectul body
    // Aceasta este echivalent cu: const name = body.name; const email = body.email; etc.
    const { name, email, phone, service, message } = body

    // Validăm datele - verificăm că toate câmpurile obligatorii sunt completate
    // "!" înseamnă "nu" - deci "!name" înseamnă "dacă name nu există sau e gol"
    // "||" înseamnă "SAU" - dacă oricare câmp lipsește, returnăm eroare
    if (!name || !email || !phone || !service) {
      // Status 400 = "Bad Request" (cerere greșită - datele trimise nu sunt complete)
      return NextResponse.json(
        { error: 'Toate câmpurile obligatorii trebuie completate' },
        { status: 400 }
      )
    }

    // Creăm un "transporter" - acesta este obiectul care se conectează la Gmail
    // și trimite email-uri. "createTransport" configurează conexiunea cu serverul de email
    const transporter = nodemailer.createTransport({
      // Specificăm că folosim serviciul Gmail
      service: 'gmail',
      // "auth" = autentificare - credențialele contului Gmail
      auth: {
        // Adresa de email Gmail (din variabila de mediu)
        user: process.env.GMAIL_USER,
        // Parola sau "App Password" Gmail (din variabila de mediu)
        pass: process.env.GMAIL_PASSWORD,
      },
    })

    // Trimitem email-ul folosind transporter-ul configurat mai sus
    // "sendMail" primește un obiect cu detaliile email-ului
    await transporter.sendMail({
      // "from" = de la cine vine email-ul (apare ca expeditor)
      from: `"Site BC" <${process.env.GMAIL_USER}>`,
      // "to" = către cine trimitem (în acest caz, tot la noi - primim mesajul pe email-ul nostru)
      to: process.env.GMAIL_USER,
      // "replyTo" = când apăsăm "Reply" pe email, va răspunde direct vizitatorului
      replyTo: email,
      // "subject" = subiectul email-ului
      subject: `Mesaj nou de la ${name} - ${service}`,
      // "html" = conținutul email-ului în format HTML (permite formatare cu culori, bold, etc.)
      // Folosim template literals (backticks `) pentru a insera variabile cu ${variabila}
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #fbbf24;">Mesaj nou din formularul de contact</h2>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nume:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Telefon:</strong> <a href="tel:${phone}">${phone}</a></p>
            <p><strong>Serviciu:</strong> ${service}</p>
          </div>

          ${message ? `
            <div style="margin: 20px 0;">
              <h3 style="color: #374151;">Mesaj:</h3>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          ` : ''}

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

          <p style="color: #6b7280; font-size: 14px;">
            Acest email a fost trimis de pe site-ul tău de fotografie.
          </p>
        </div>
      `,
    })

    // Dacă totul a mers bine, trimitem un răspuns de succes
    return NextResponse.json({ success: true })
  } catch (error) {
    // Dacă apare o eroare la trimiterea email-ului, o afișăm în consolă
    console.error('Error sending email:', error)

    // Răspundem cu eroare 500 (Internal Server Error)
    return NextResponse.json(
      { error: 'A apărut o eroare la trimiterea mesajului' },
      { status: 500 }
    )
  }
}
