import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
    console.error('Gmail credentials not configured')
    return NextResponse.json(
      { error: 'Serviciul de email nu este configurat. Te rog contactează-ne direct la costinfoto@gmail.com' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { name, email, phone, service, message } = body

    if (!name || !email || !phone || !service) {
      return NextResponse.json(
        { error: 'Toate câmpurile obligatorii trebuie completate' },
        { status: 400 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"Site BC" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `Mesaj nou de la ${name} - ${service}`,
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'A apărut o eroare la trimiterea mesajului' },
      { status: 500 }
    )
  }
}
