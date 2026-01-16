# 🎥 Suport pentru Video și Imagini Mari

## Ce am modificat?

### Problema inițială:
1. ❌ Limită de **50MB** pentru fișiere
2. ❌ Doar **imagini** acceptate (nu video)
3. ❌ Next.js avea limită de **4MB** pentru body size
4. ❌ Nu puteai încărca fotografii profesionale mari

### Soluția implementată:

## 📋 Modificări tehnice

### 1. **Schema bazei de date** (`prisma/schema.prisma`)
Am adăugat 2 câmpuri noi în modelul `Image`:
```prisma
mimeType  String?  // Tipul fișierului (image/jpeg, video/mp4, etc.)
duration  Int?     // Durata video-ului în secunde (doar pentru video)
```

**De ce?**
- `mimeType` ne ajută să știm dacă e imagine sau video
- `duration` e util pentru video-uri (poți afișa durata în galerie)

### 2. **Next.js Config** (`next.config.ts`)
Am adăugat:
```typescript
experimental: {
  serverActions: {
    bodySizeLimit: '100mb', // Limită de 100MB
  },
}
```

**De ce?**
- Next.js implicit permite doar 4MB
- Acum poți încărca fișiere până la 100MB

### 3. **API Upload** (`src/app/api/admin/images/upload/route.ts`)

#### Înainte:
```typescript
// Validate file size (50MB max)
if (file.size > 50 * 1024 * 1024) {
  continue // Skip
}

// Validate file type
if (!file.type.startsWith('image/')) {
  continue // Skip non-image files
}
```

#### Acum:
```typescript
// Limită de 500MB (suficient pentru video 4K)
const maxSize = 500 * 1024 * 1024

// Acceptă imagini ȘI video
const acceptedTypes = [
  // Imagini
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
  'image/webp', 'image/heic', 'image/heif',
  // Video
  'video/mp4', 'video/quicktime', 'video/x-msvideo', 
  'video/x-matroska', 'video/webm'
]
```

**De ce?**
- 500MB e suficient pentru video 4K de câteva minute
- Suportă toate formatele populare de imagini și video
- HEIC/HEIF = fotografii de pe iPhone

### 4. **TypeScript Types** (`src/types/index.ts`)
Am actualizat interfața `Image`:
```typescript
export interface Image {
  // ... câmpuri existente
  mimeType?: string | null   // NOU
  duration?: number | null   // NOU
}
```

## 🎯 Ce poți face acum?

### Formate acceptate:

#### 📸 Imagini:
- ✅ JPEG/JPG (cel mai comun)
- ✅ PNG (cu transparență)
- ✅ GIF (animații)
- ✅ WebP (modern, comprimat)
- ✅ HEIC/HEIF (iPhone)

#### 🎬 Video:
- ✅ MP4 (cel mai comun)
- ✅ MOV (QuickTime, iPhone)
- ✅ AVI (Windows)
- ✅ MKV (Matroska)
- ✅ WebM (web)

### Limite de dimensiune:
- **Maxim per fișier:** 500MB
- **Recomandat pentru imagini:** 5-50MB
- **Recomandat pentru video:** 50-300MB

## 📱 Cum să folosești?

### 1. Intră în panoul de administrare:
```
http://localhost:3000/admin/login
Email: costinfoto@gmail.com
Parolă: admin123@
```

### 2. Navighează la un eveniment:
- Click pe "Evenimente" în sidebar
- Selectează un eveniment existent sau creează unul nou
- Click pe "Gestionează imagini"

### 3. Încarcă fișiere:
- Click pe "Alege fișiere" sau drag & drop
- Selectează imagini ȘI/SAU video-uri
- Sistemul le va încărca automat

### 4. Verifică:
- Fișierele vor apărea în galerie
- Video-urile vor avea un icon special
- Poți reordona, șterge, sau dezactiva fișiere

## 🔧 Configurare avansată

### Vrei să crești limita peste 500MB?

**1. În `next.config.ts`:**
```typescript
bodySizeLimit: '1gb', // Schimbă la 1GB
```

**2. În `src/app/api/admin/images/upload/route.ts`:**
```typescript
const maxSize = 1000 * 1024 * 1024 // 1GB în bytes
```

### Vrei să adaugi alte formate?

În `src/app/api/admin/images/upload/route.ts`, adaugă în array-ul `acceptedTypes`:
```typescript
const acceptedTypes = [
  // ... existente
  'video/mpeg',  // MPEG
  'video/ogg',   // OGG
  'image/bmp',   // BMP
  // etc.
]
```

## ⚠️ Limitări importante

### 1. **Vercel Blob Storage**
- Trebuie să ai `BLOB_READ_WRITE_TOKEN` configurat în `.env`
- Plan gratuit: 1GB storage
- Plan Pro: 100GB storage
- Obține token de pe: https://vercel.com/dashboard/stores

### 2. **Performanță**
- Fișiere mari (>100MB) pot dura câteva minute să se încarce
- Depinde de viteza internetului
- Browserul poate părea blocat - e normal!

### 3. **Hosting**
- Vercel are timeout de 10 secunde pentru funcții (plan gratuit)
- Pentru fișiere foarte mari, consideră Vercel Pro sau alt hosting

## 🎨 Afișare în frontend

Sistemul detectează automat dacă e imagine sau video:

```typescript
// În componente, verifică mimeType:
{image.mimeType?.startsWith('video/') ? (
  <video src={image.url} controls />
) : (
  <img src={image.url} alt={image.alt} />
)}
```

## 📊 Monitorizare

### Verifică dimensiunea fișierelor:
```typescript
// În console.log vei vedea:
"Uploading photo.jpg (15.3MB)..."
"Successfully uploaded photo.jpg"
```

### Verifică storage-ul:
- Dashboard Vercel: https://vercel.com/dashboard/stores
- Vezi câtă spațiu ai folosit
- Vezi toate fișierele încărcate

## 🐛 Probleme comune

### "Request Entity Too Large"
- Fișierul e prea mare (>500MB)
- Crește limita în config (vezi mai sus)

### "Unsupported file type"
- Formatul nu e în lista acceptată
- Adaugă formatul în `acceptedTypes`

### Upload-ul durează foarte mult
- Normal pentru fișiere mari
- Verifică viteza internetului
- Consideră comprimarea video-urilor

### Video-ul nu se redă în browser
- Unele formate (AVI, MKV) nu sunt suportate de browsere
- Convertește la MP4 pentru compatibilitate maximă

## 💡 Sfaturi

1. **Pentru fotografii profesionale:**
   - Exportă la calitate 90-95% (nu 100%)
   - Rezoluție maximă: 4000-6000px lățime
   - Format recomandat: JPEG

2. **Pentru video-uri:**
   - Codec recomandat: H.264 (MP4)
   - Rezoluție: 1080p sau 4K
   - Bitrate: 5-15 Mbps pentru 1080p

3. **Optimizare:**
   - Folosește Adobe Lightroom pentru export imagini
   - Folosește HandBrake pentru comprimare video
   - Păstrează originalele pe hard disk

## 🚀 Next Steps

Vrei să adaugi:
- ✨ Thumbnail-uri automate pentru video?
- ✨ Progress bar pentru upload?
- ✨ Comprimare automată?
- ✨ Watermark pe imagini?

Spune-mi și te ajut să implementezi!
