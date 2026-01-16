import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

/**
 * Salvează un fișier local în folderul public/uploads
 * Alternativă la Vercel Blob pentru development
 */
export async function saveFileLocally(file: File, filename: string): Promise<{ url: string; filename: string }> {
  try {
    // Creează folderul uploads dacă nu există
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Convertește File la Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Salvează fișierul
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // Returnează URL-ul public
    return {
      url: `/uploads/${filename}`,
      filename: filename
    }
  } catch (error) {
    console.error('Error saving file locally:', error)
    throw new Error('Failed to save file')
  }
}

/**
 * Șterge un fișier local
 */
export async function deleteFileLocally(filename: string): Promise<void> {
  try {
    const { unlink } = await import('fs/promises')
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename)
    
    if (existsSync(filePath)) {
      await unlink(filePath)
    }
  } catch (error) {
    console.error('Error deleting file locally:', error)
    throw new Error('Failed to delete file')
  }
}
