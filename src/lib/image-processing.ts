import sharp from 'sharp';

// Setari pentru Optimizarea 
const MAX_WIDTH = 2000; // Latimea maxima a imaginii
const THUMBNAIL_WIDTH = 400; // Latimea maxima a thumbnail-ului
const QUALITY = 80; // Calitatea imaginii (0-100)

// functia principala - micsoreaza o imagine 
export async function optimizeImage(file: File): Promise<{
    optimized: Buffer;
    thumbnail: Buffer;
    width: number;
    height: number;
}> {
   // 1. Transformam fisierul intr-un format pe care sharp il intelege
   const arrayBuffer = await file.arrayBuffer();
   const buffer = Buffer.from(arrayBuffer); 
   // 2. Creăm imaginea optimizată (cea mare, dar nu imensă)
    const optimized = await sharp(buffer)
      .resize(MAX_WIDTH, null, {    // Redimensionăm la max 2000px lățime
        withoutEnlargement: true,   // Nu mări pozele mici
        fit: 'inside'               // Păstrează proporțiile
      })
      .webp({ quality: QUALITY })   // Convertim la WebP (format modern, mai mic)
      .toBuffer()

    // 3. Creăm thumbnail-ul (poza mică pentru galerie)
    const thumbnail = await sharp(buffer)
      .resize(THUMBNAIL_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 75 })       // Calitate puțin mai mică, e ok pentru thumbnail
      .toBuffer()

    // 4. Obținem dimensiunile imaginii optimizate
    const metadata = await sharp(optimized).metadata()

    return {
      optimized,
      thumbnail,
      width: metadata.width || 0,
      height: metadata.height || 0
    }
  }