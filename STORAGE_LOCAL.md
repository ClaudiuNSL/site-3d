# 💾 Storage Local - Soluția pentru Development

## 🔍 Problema

Când ai încercat să încarci poze, ai primit eroarea:
```
Error: Vercel Blob: No token found
```

**De ce?** Aplicația era configurată să folosească Vercel Blob Storage (cloud), dar nu aveai token-ul configurat.

## ✅ Soluția implementată

Am adăugat **suport pentru storage local** - fișierele se salvează direct pe disk în folderul `public/uploads/`.

### Cum funcționează?

Sistemul verifică automat dacă ai token Vercel Blob:
- ✅ **Dacă DA** → Folosește Vercel Blob (cloud)
- ✅ **Dacă NU** → Salvează local pe disk

## 📁 Structura fișierelor

```
site-3d/
├── public/
│   └── uploads/          ← Fișierele tale (imagini/video)
│       ├── event1-123456-0.jpg
│       ├── event1-123456-1.mp4
│       └── ...
├── src/
│   └── lib/
│       └── local-storage.ts  ← NOU: Funcții pentru storage local
```

## 🚀 Cum să folosești

### 1. Încarcă fișiere

Mergi la:
```
http://localhost:3000/admin/login
Email: costinfoto@gmail.com
Parolă: admin123@
```

Apoi:
1. Click pe "Evenimente"
2. Selectează un eveniment
3. Click "Gestionează imagini"
4. Alege fișiere (imagini sau video)
5. Click "Încarcă"

### 2. Fișierele se salvează automat

În terminal vei vedea:
```
Storage mode: Local Disk
Uploading photo.jpg (15.3MB)...
Successfully uploaded photo.jpg
```

### 3. Verifică fișierele

Fișierele sunt în:
```
site-3d/public/uploads/
```

Poți să le vezi și în browser:
```
http://localhost:3000/uploads/nume-fisier.jpg
```

## 🎯 Avantaje Storage Local

### ✅ Pentru Development:
- **Simplu** - Nu trebuie să configurezi nimic
- **Rapid** - Fișierele se salvează instant
- **Gratuit** - Nu ai limite de storage
- **Offline** - Funcționează fără internet

### ❌ Dezavantaje:
- Fișierele se pierd dacă ștergi folderul
- Nu funcționează pe Vercel (hosting)
- Nu ai backup automat

## 🌐 Pentru Producție (Vercel Blob)

Când vrei să publici site-ul, trebuie să folosești Vercel Blob:

### Pasul 1: Creează Blob Store

1. Mergi pe https://vercel.com/dashboard/stores
2. Click "Create Database" → "Blob"
3. Dă-i un nume (ex: "site-fotografie-storage")
4. Click "Create"

### Pasul 2: Obține Token

După creare, vei vedea:
```
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_abc123..."
```

### Pasul 3: Configurează .env

Copiază token-ul în `.env`:
```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_abc123..."
```

### Pasul 4: Repornește serverul

```bash
npm run dev
```

Acum în terminal vei vedea:
```
Storage mode: Vercel Blob
```

## 🔄 Migrare de la Local la Vercel Blob

Dacă ai fișiere în `public/uploads/` și vrei să le muți pe Vercel Blob:

### Opțiunea 1: Re-upload manual
1. Descarcă fișierele din `public/uploads/`
2. Configurează Vercel Blob
3. Încarcă-le din nou prin admin

### Opțiunea 2: Script de migrare (avansată)
Pot să îți creez un script care mută automat toate fișierele.

## 📊 Comparație

| Feature | Local Storage | Vercel Blob |
|---------|--------------|-------------|
| **Setup** | ✅ Automat | ⚙️ Necesită token |
| **Viteză** | ⚡ Instant | 🌐 Depinde de net |
| **Limită** | ♾️ Nelimitată | 💰 1GB gratuit |
| **Backup** | ❌ Manual | ✅ Automat |
| **Producție** | ❌ Nu funcționează | ✅ Recomandat |
| **Cost** | 💚 Gratuit | 💚 1GB gratuit |

## 🛠️ Fișiere modificate

### 1. `src/lib/local-storage.ts` (NOU)
Funcții pentru salvarea și ștergerea fișierelor local:
- `saveFileLocally()` - Salvează fișier în `public/uploads/`
- `deleteFileLocally()` - Șterge fișier din `public/uploads/`

### 2. `src/app/api/admin/images/upload/route.ts`
Detectează automat dacă există token Vercel Blob:
```typescript
const hasVercelBlob = !!process.env.BLOB_READ_WRITE_TOKEN

if (hasVercelBlob) {
  // Folosește Vercel Blob
} else {
  // Salvează local
}
```

### 3. `src/app/api/admin/images/[id]/route.ts`
Șterge fișiere din storage-ul corect (local sau cloud)

### 4. `.gitignore`
Adăugat `/public/uploads/` pentru a nu comite fișierele în Git

## 🔒 Securitate

### Fișierele sunt publice!
Orice fișier din `public/uploads/` poate fi accesat direct:
```
http://localhost:3000/uploads/fisier.jpg
```

**Pentru producție:**
- Folosește Vercel Blob (mai sigur)
- Adaugă autentificare pentru fișiere sensibile
- Folosește CDN pentru performanță

## 🐛 Troubleshooting

### "Cannot find module 'fs/promises'"
**Cauză:** Rulezi în browser (client-side)
**Soluție:** Funcțiile de storage rulează doar pe server (API routes)

### Fișierele nu apar în galerie
**Cauză:** URL-ul e greșit sau fișierul nu există
**Soluție:** Verifică `public/uploads/` și URL-ul în baza de date

### "ENOENT: no such file or directory"
**Cauză:** Folderul `public/uploads/` nu există
**Soluție:** Se creează automat la primul upload

### Fișierele dispar după restart
**Cauză:** Folderul `public/uploads/` a fost șters
**Soluție:** Fișierele rămân pe disk, verifică dacă există

## 💡 Tips

### 1. Backup fișierelor
```bash
# Copiază toate fișierele
xcopy public\uploads backup\uploads /E /I
```

### 2. Curăță fișierele vechi
```bash
# Șterge toate fișierele
rmdir /s /q public\uploads
```

### 3. Verifică dimensiunea
```bash
# Vezi cât spațiu ocupă
dir public\uploads /s
```

## 🎓 Ce ai învățat

1. **Dual storage system** - Aplicația poate folosi 2 tipuri de storage
2. **Environment variables** - Configurare prin `.env`
3. **File system în Node.js** - `fs/promises` pentru operații cu fișiere
4. **Conditional logic** - Cod care se adaptează la configurație

## 📞 Suport

Dacă ai probleme:
1. Verifică că serverul rulează (`npm run dev`)
2. Verifică consola browser-ului (F12)
3. Verifică terminalul pentru erori
4. Verifică că folderul `public/uploads/` există

---

**Status:** ✅ Funcțional
**Testat cu:** Imagini până la 50MB
**Recomandat pentru:** Development local
**Pentru producție:** Configurează Vercel Blob
