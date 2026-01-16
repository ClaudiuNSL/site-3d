# 🚀 Cum să publici site-ul pe Vercel (GRATUIT)

## De ce Vercel?
- ✅ **Gratuit** pentru proiecte personale
- ✅ **Automat** - se actualizează când faci push pe GitHub
- ✅ **Rapid** - CDN global
- ✅ **SSL gratuit** - HTTPS automat
- ✅ **Făcut pentru Next.js** - zero configurare

## 📋 Pași pentru publicare

### 1. Creează cont pe Vercel

1. Mergi pe: **https://vercel.com/signup**
2. Click pe "Continue with GitHub"
3. Autorizează Vercel să acceseze GitHub-ul tău

### 2. Importă proiectul

1. După login, click pe **"Add New..."** → **"Project"**
2. Vei vedea lista de repository-uri GitHub
3. Găsește **"site-3d"** și click pe **"Import"**

### 3. Configurează proiectul

Vercel va detecta automat că e Next.js. Lasă setările default:
- **Framework Preset:** Next.js
- **Root Directory:** ./
- **Build Command:** `npm run build`
- **Output Directory:** .next

### 4. Adaugă Environment Variables

**IMPORTANT!** Click pe **"Environment Variables"** și adaugă:

```env
# Baza de date (TREBUIE SCHIMBATĂ!)
DATABASE_URL="postgresql://user:password@host/database"

# NextAuth
NEXTAUTH_URL="https://numele-tau-site.vercel.app"
NEXTAUTH_SECRET="genereaza-un-secret-random-aici"

# Resend (pentru email-uri)
RESEND_API_KEY="re_abc123_API_KEY_DE_PE_RESEND"

# Vercel Blob (pentru imagini/video)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_abc123"
```

#### Cum obții fiecare:

**DATABASE_URL:**
1. În Vercel, click pe "Storage" → "Create Database" → "Postgres"
2. Copiază connection string-ul
3. Lipește-l în `DATABASE_URL`

**NEXTAUTH_SECRET:**
```bash
# Generează unul random:
openssl rand -base64 32
```
Sau folosește: https://generate-secret.vercel.app/32

**RESEND_API_KEY:**
1. Mergi pe https://resend.com/api-keys
2. Creează API key
3. Copiază-l

**BLOB_READ_WRITE_TOKEN:**
1. În Vercel, click pe "Storage" → "Create Database" → "Blob"
2. Copiază token-ul
3. Lipește-l

### 5. Deploy!

Click pe **"Deploy"**

Vercel va:
1. ✅ Clona codul de pe GitHub
2. ✅ Instala dependențele (`npm install`)
3. ✅ Rula build-ul (`npm run build`)
4. ✅ Publica site-ul

Durează ~2-3 minute.

### 6. Rulează migrațiile bazei de date

După deploy, trebuie să creezi tabelele în baza de date:

1. În Vercel dashboard, mergi la proiectul tău
2. Click pe "Settings" → "Environment Variables"
3. Copiază `DATABASE_URL`
4. În terminalul tău local:

```bash
# Setează DATABASE_URL temporar
$env:DATABASE_URL="postgresql://..."

# Rulează migrațiile
npx prisma migrate deploy

# Populează baza de date
npx prisma db seed
```

### 7. Gata! 🎉

Site-ul tău e live la:
```
https://site-3d-abc123.vercel.app
```

Poți să îi schimbi numele în Settings → Domains.

## 🔄 Actualizări automate

De acum, **de fiecare dată când faci push pe GitHub**, Vercel va:
1. Detecta modificările
2. Face build automat
3. Publica noua versiune

```bash
# Faci modificări locale
git add .
git commit -m "modificare"
git push origin main

# Vercel face deploy automat în ~2 minute!
```

## 🌐 Domeniu personalizat (opțional)

Dacă ai un domeniu (ex: `bancucostin.ro`):

1. În Vercel, mergi la Settings → Domains
2. Adaugă domeniul tău
3. Configurează DNS-ul (Vercel îți arată cum)

## ⚠️ Probleme comune

### "Build failed"
**Cauză:** Erori în cod sau lipsesc environment variables
**Soluție:** Verifică logs în Vercel și adaugă toate variabilele

### "Database connection failed"
**Cauză:** `DATABASE_URL` lipsește sau e greșit
**Soluție:** Verifică că ai adăugat-o în Environment Variables

### "Resend error"
**Cauză:** `RESEND_API_KEY` lipsește
**Soluție:** Adaugă API key-ul de pe resend.com

### Imaginile nu se încarcă
**Cauză:** `BLOB_READ_WRITE_TOKEN` lipsește
**Soluție:** Creează Blob Storage în Vercel și adaugă token-ul

## 💰 Costuri

### Plan Gratuit (Hobby):
- ✅ Bandwidth: 100GB/lună
- ✅ Build time: 6000 minute/lună
- ✅ Serverless functions: 100GB-Hrs
- ✅ Postgres: 256MB storage
- ✅ Blob: 1GB storage
- ✅ SSL gratuit
- ✅ Domeniu custom gratuit

**Suficient pentru un site de fotografie personal!**

### Când ai nevoie de upgrade:
- Trafic > 100GB/lună
- Storage > 1GB imagini/video
- Funcții serverless intensive

## 📊 Monitorizare

În Vercel dashboard poți vedea:
- 📈 Trafic și vizitatori
- ⚡ Performanță (viteza site-ului)
- 🐛 Erori și logs
- 💾 Utilizare storage

## 🔐 Securitate

Vercel oferă automat:
- ✅ HTTPS (SSL)
- ✅ DDoS protection
- ✅ Firewall
- ✅ Edge caching

## 🎓 Resurse

- Dashboard Vercel: https://vercel.com/dashboard
- Documentație: https://vercel.com/docs
- Suport: https://vercel.com/support

---

**Timpul total:** ~15 minute
**Dificultate:** ⭐⭐ (Ușor)
**Cost:** 💚 Gratuit
