export interface User {
  id: string
  email: string
  name?: string | null
  role: string
}

export interface Category {
  id: string
  name: string
  slug: string
  subtitle?: string | null
  icon?: string | null
  description?: string | null
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  events?: Event[]
}

export interface Event {
  id: string
  name: string
  slug: string
  description?: string | null
  date?: Date | null
  location?: string | null
  isActive: boolean
  order: number
  createdAt: Date
  updatedAt: Date
  categoryId: string
  category?: Category
  images?: Image[]
}

export interface Image {
  id: string
  filename: string
  originalName?: string | null
  url: string
  thumbnailUrl?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  size?: number | null
  mimeType?: string | null  // Tipul fișierului (image/jpeg, video/mp4, etc.)
  duration?: number | null   // Durata video-ului în secunde
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  eventId: string
  event?: Event
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      role: string
    }
  }

  interface User {
    role: string
  }
}