import { auth } from '@/lib/auth'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextRequest, NextResponse } from 'next/server'

// Ruta pentru client-side upload direct la Vercel Blob
// Aceasta ocolește limita de body size a serverless functions (4.5MB)
// Fișierele merg direct din browser la Vercel Blob CDN

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Nu ești autentificat' }, { status: 401 })
    }

    const body = await request.json() as HandleUploadBody

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Verificăm autentificarea
        const session = await auth()
        if (!session) {
          throw new Error('Nu ești autentificat')
        }

        return {
          allowedContentTypes: [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif',
            'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'
          ],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500MB
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error('Error in client upload handler:', error)
    return NextResponse.json(
      { error: 'Eroare la upload' },
      { status: 500 }
    )
  }
}
