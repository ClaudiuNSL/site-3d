# 📧 Configurare Email pentru Formularul de Contact

## Ce am modificat?

### 1. **Problema inițială**
Formularul doar **simula** trimiterea email-ului cu `setTimeout()`. Nu trimite nimic real!

### 2. **Soluția implementată**

Am creat un sistem complet de trimitere email-uri:

#### A. API Endpoint nou: `/api/contact`
- Fișier: `src/app/api/contact/route.ts`
- Primește datele din formular
- Trimite email către `costinfoto@gmail.com`
- Folosește serviciul **Resend** pentru trimiterea email-urilor

#### B. Formular actualizat
- Fișier: `src/app/page.tsx`
- Acum face un request **real** către API
- Gestionează erorile corect
- Afișează mesaje de succes/eroare reale

## 🚀 Cum să activezi trimiterea de email-uri?

### Pasul 1: Creează cont pe Resend (GRATUIT)

1. Mergi pe: **https://resend.com**
2. Creează cont gratuit (100 email-uri/zi gratis)
3. Verifică-ți email-ul

### Pasul 2: Obține API Key

1. După login, mergi la: **https://resend.com/api-keys**
2. Click pe "Create API Key"
3. Dă-i un nume (ex: "Site Fotografie")
4. Copiază API key-ul (arată așa: `re_123abc...`)

### Pasul 3: Configurează .env

Deschide fișierul `.env` și înlocuiește:

```env
RESEND_API_KEY="re_123456789_YOUR_API_KEY_HERE"
```

Cu API key-ul tău real:

```env
RESEND_API_KEY="re_abc123xyz_CHEIA_TA_REALA"
```

### Pasul 4: Repornește serverul

```bash
# Oprește serverul (Ctrl+C în terminal)
# Apoi pornește-l din nou:
npm run dev
```

### Pasul 5: Testează!

1. Mergi pe site: http://localhost:3000
2. Scroll la secțiunea Contact
3. Completează formularul
4. Trimite mesajul
5. Verifică inbox-ul la `costinfoto@gmail.com`

## 📝 Cum funcționează?

```
┌─────────────┐
│  Formular   │  1. User completează formularul
│   Contact   │
└──────┬──────┘
       │
       │ 2. Click "Trimite"
       ▼
┌─────────────┐
│  page.tsx   │  3. JavaScript trimite datele
│handleSubmit │     către API cu fetch()
└──────┬──────┘
       │
       │ 4. POST /api/contact
       ▼
┌─────────────┐
│/api/contact │  5. API primește datele
│  route.ts   │     și le trimite către Resend
└──────┬──────┘
       │
       │ 6. Resend trimite email-ul
       ▼
┌─────────────┐
│   Resend    │  7. Email ajunge la
│   Service   │     costinfoto@gmail.com
└──────┬──────┘
       │
       ▼
   📧 Email primit!
```

## 🎨 Personalizare

### Schimbă email-ul destinatar

În `src/app/api/contact/route.ts`, linia 24:

```typescript
to: ['costinfoto@gmail.com'], // Schimbă cu email-ul tău
```

### Schimbă subiectul email-ului

În `src/app/api/contact/route.ts`, linia 25:

```typescript
subject: `Mesaj nou de la ${name} - ${service}`,
```

### Personalizează template-ul email-ului

În `src/app/api/contact/route.ts`, liniile 26-50, poți modifica HTML-ul email-ului.

## ⚠️ Important!

1. **Nu uita să adaugi `.env` în `.gitignore`** (deja este)
2. **Nu partaja niciodată API key-ul public**
3. Pentru producție, folosește un domeniu verificat în Resend
4. Limita gratuită: 100 email-uri/zi, 3000/lună

## 🐛 Probleme comune

### "Error sending email"
- Verifică că API key-ul este corect în `.env`
- Verifică că ai repornit serverul după modificarea `.env`

### Email-ul nu ajunge
- Verifică spam/junk folder
- Verifică că email-ul destinatar este corect
- Verifică dashboard-ul Resend pentru status

### "Failed to fetch"
- Verifică că serverul Next.js rulează
- Verifică consola browser-ului pentru erori

## 📚 Resurse

- Documentație Resend: https://resend.com/docs
- Dashboard Resend: https://resend.com/emails
- API Keys: https://resend.com/api-keys
