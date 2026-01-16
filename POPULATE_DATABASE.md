# 🗄️ Cum să populezi baza de date pe Vercel

## Problema
Site-ul e live dar nu apar serviciile pentru că baza de date PostgreSQL de pe Vercel e goală.

## Soluția

### Pasul 1: Obține DATABASE_URL de pe Vercel

1. Mergi pe Vercel Dashboard
2. Click pe proiectul tău "site-3d"
3. Click pe tab-ul **"Settings"**
4. Click pe **"Environment Variables"**
5. Găsește `DATABASE_URL` și click pe **"Show"**
6. Copiază întreaga valoare (arată așa: `postgresql://user:pass@host/db`)

### Pasul 2: Setează DATABASE_URL temporar în terminal

**În Windows PowerShell:**
```powershell
$env:DATABASE_URL="postgresql://user:pass@host/db"
```

**Înlocuiește** `postgresql://user:pass@host/db` cu valoarea ta reală!

### Pasul 3: Rulează migrațiile

```bash
npx prisma migrate deploy
```

Acest command va crea toate tabelele în baza de date PostgreSQL.

### Pasul 4: Populează baza de date cu servicii

```bash
npx prisma db seed
```

Acest command va adăuga:
- ✅ User admin (costinfoto@gmail.com / admin123@)
- ✅ 9 categorii de servicii (Nuntă, Botez, Save the Date, etc.)

### Pasul 5: Verifică

Mergi pe **www.banciucostin.ro** și reîmprospătează pagina (F5).

Ar trebui să vezi toate cele 9 servicii! 🎉

---

## 🎯 Comenzi complete (copy-paste):

```powershell
# 1. Setează DATABASE_URL (înlocuiește cu al tău!)
$env:DATABASE_URL="postgresql://default:abc123@ep-xyz.us-east-1.aws.neon.tech/verceldb"

# 2. Rulează migrațiile
npx prisma migrate deploy

# 3. Populează cu date
npx prisma db seed

# 4. Verifică conexiunea
npx prisma db pull
```

---

## ⚠️ Probleme comune

### "Environment variable not found: DATABASE_URL"
**Cauză:** Nu ai setat DATABASE_URL în terminal
**Soluție:** Rulează din nou comanda `$env:DATABASE_URL="..."`

### "Can't reach database server"
**Cauză:** DATABASE_URL e greșit sau baza de date nu e accesibilă
**Soluție:** Verifică că ai copiat corect URL-ul din Vercel

### "Migration failed"
**Cauză:** Tabelele există deja sau sunt conflicte
**Soluție:** Șterge baza de date din Vercel și creează una nouă

---

## 🔐 Securitate

**IMPORTANT:** Nu comite niciodată DATABASE_URL în Git!
- Folosește-l doar temporar în terminal
- După ce termini, închide terminalul
- DATABASE_URL rămâne secret în Vercel

---

## 📊 Ce date se adaugă?

### User Admin:
- Email: `costinfoto@gmail.com`
- Parolă: `admin123@`
- Rol: ADMIN

### Categorii (9):
1. 💍 Nuntă - "O zi, o viață de amintiri"
2. 👶 Botez - "Magia începuturilor"
3. 📅 Save the Date - "Primul capitol din povestea voastră"
4. 💑 Cuplu - "Iubirea în fiecare cadru"
5. 👨‍👩‍👧‍👦 Familie - "Momente prețioase împreună"
6. 👰 Trash the Dress - "Aventură după nuntă"
7. 🎓 Absolvire - "Încheierea unui capitol"
8. 💼 Profesional - "Imaginea ta profesională"
9. 🎭 Fotografii amuzante - "Distracție și creativitate"

---

## 🚀 După ce populezi baza de date

Poți să:
1. ✅ Vezi serviciile pe site
2. ✅ Te loghezi în admin: www.banciucostin.ro/admin/login
3. ✅ Adaugi evenimente și imagini
4. ✅ Gestionezi categoriile

---

**Timp necesar:** ~2 minute
**Dificultate:** ⭐ (Foarte ușor)
