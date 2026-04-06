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

export interface ShowreelVideo {
  id: string
  title: string
  subtitle?: string | null
  videoUrl: string
  thumbnailUrl?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface HeroSlide {
  id: string
  filename: string
  originalName?: string | null
  url: string
  alt?: string | null
  title?: string | null
  subtitle?: string | null
  order: number
  isActive: boolean
  size?: number | null
  createdAt: Date
  updatedAt: Date
}

export interface PackageFeature {
  icon: string
  text: string
}

export interface PackageExtra {
  text: string
  price: string
}

export interface PackageNote {
  icon: string
  text: string
}

export interface Package {
  id: string
  name: string
  icon: string
  price: number
  currency: string
  tier: string
  badge?: string | null
  features: PackageFeature[]
  extras: PackageExtra[]
  notes: PackageNote[]
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
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