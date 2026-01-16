import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Inițializăm Resend cu API key-ul din .env
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    // Extragem datele din request
    const body = await request.json()
    const { name, email, phone, service, message } = body

    // Validare de bază
    if (!name || !email || !phone || !service) {
      return NextResponse.json(
        { error: 'Toate câmpurile obligatorii trebuie completate' },
        { status: 400 }
      )
    }

    // Trimitem email-ul
    const data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Email-ul de la care se trimite
      to: ['costinfoto@gmail.com'], // Email-ul proprietarului (TU!)
      subject: `Mesaj nou de la ${name} - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">Mesaj nou din formularul de contact</h2>
          
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

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'A apărut o eroare la trimiterea mesajului' },
      { status: 500 }
    )
  }
}
