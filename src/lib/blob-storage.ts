import { put, del } from '@vercel/blob'

export async function uploadImage(file: File, path: string): Promise<{ url: string; filename: string }> {
  try {
    const timestamp = Date.now()
    const filename = `${path}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const blob = await put(filename, file, {
      access: 'public',
    })

    return {
      url: blob.url,
      filename: filename
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image')
  }
}

export async function deleteImage(url: string): Promise<void> {
  try {
    await del(url)
  } catch (error) {
    console.error('Error deleting image:', error)
    throw new Error('Failed to delete image')
  }
}

export function getImagePath(category: string, event: string): string {
  return `images/${category}/${event}`
}