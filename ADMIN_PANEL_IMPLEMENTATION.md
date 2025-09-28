# Admin Panel Implementation Guide
## Photography Website Admin System

### Project Overview
This document outlines the implementation of an admin panel for a photography website built with Next.js. The system will allow an admin to:
- Authenticate securely
- Manage categories (Nuntă, Botez, etc.)
- Manage events within categories (Alex's Botez, Mariana's Nuntă)
- Upload and manage photos for each event
- Display content on the main page organized by categories

### Technology Stack
- **Framework**: Next.js 15.5.4 with App Router
- **Authentication**: NextAuth.js v5
- **Database**: Prisma ORM with NeonDB (PostgreSQL)
- **File Storage**: Vercel Blob Storage
- **UI**: Tailwind CSS v4
- **TypeScript**: Full TypeScript support

### Database Schema Design

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      String   @default("ADMIN")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  events      Event[]

  @@map("categories")
}

model Event {
  id          String   @id @default(cuid())
  name        String
  slug        String
  description String?
  date        DateTime?
  isActive    Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  images      Image[]

  @@unique([slug, categoryId])
  @@map("events")
}

model Image {
  id          String   @id @default(cuid())
  filename    String
  originalName String?
  url         String
  thumbnailUrl String?
  alt         String?
  width       Int?
  height      Int?
  size        Int?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  eventId     String
  event       Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@map("images")
}
```

### Environment Variables Required

```env
# .env.local
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── categories/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── admin/
│   │   │   ├── categories/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── events/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── images/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           └── route.ts
│   │   └── upload/
│   │       └── route.ts
│   ├── gallery/
│   │   └── [category]/
│   │       └── [event]/
│   │           └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx
│   │   ├── CategoryForm.tsx
│   │   ├── EventForm.tsx
│   │   ├── ImageUpload.tsx
│   │   └── LoginForm.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Card.tsx
│   └── Gallery.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── utils.ts
│   └── validations.ts
├── types/
│   └── index.ts
└── middleware.ts
```

### Implementation Steps

#### 1. Install Required Dependencies

```bash
npm install next-auth@beta prisma @prisma/client @vercel/blob bcryptjs zod
npm install -D @types/bcryptjs prisma
```

#### 2. Initialize Prisma

```bash
npx prisma init
```

#### 3. Set up NextAuth.js Configuration

Create `src/lib/auth.ts`:
```typescript
import { NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "./db"

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')

      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  }
}
```

#### 4. Create Database Connection

Create `src/lib/db.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

#### 5. Set up Middleware

Create `src/middleware.ts`:
```typescript
import { auth } from "./lib/auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth')
  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isAdminLogin = nextUrl.pathname === '/admin/login'

  if (isApiAuthRoute) {
    return
  }

  if (isAdminRoute) {
    if (isAdminLogin) {
      if (isLoggedIn) {
        return Response.redirect(new URL('/admin/dashboard', nextUrl))
      }
      return
    }

    if (!isLoggedIn) {
      return Response.redirect(new URL('/admin/login', nextUrl))
    }
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
```

#### 6. Database Seed Script

Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@photography.com' },
    update: {},
    create: {
      email: 'admin@photography.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  })

  // Create default categories
  const categories = [
    { name: 'Nuntă', slug: 'nunta', description: 'Fotografii de nuntă' },
    { name: 'Botez', slug: 'botez', description: 'Fotografii de botez' },
    { name: 'Eveniment', slug: 'eveniment', description: 'Alte evenimente' },
    { name: 'Save the Date', slug: 'save-the-date', description: 'Fotografii Save the Date' }
  ]

  for (const [index, category] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        ...category,
        order: index
      }
    })
  }

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Update `package.json`:
```json
{
  "scripts": {
    "db:seed": "tsx prisma/seed.ts",
    "db:push": "prisma db push",
    "db:generate": "prisma generate"
  }
}
```

### Key Features Implementation

#### Admin Authentication
- Secure login with NextAuth.js
- Password hashing with bcrypt
- Session management
- Route protection

#### Category Management
- CRUD operations for categories
- Slug generation
- Order management
- Active/inactive status

#### Event Management
- CRUD operations for events
- Association with categories
- Date management
- Order within categories

#### Image Management
- File upload to Vercel Blob Storage
- Thumbnail generation
- Metadata storage
- Order management within events
- Bulk upload support

#### Public Gallery
- Category-based navigation
- Event-based organization
- Responsive image display
- Lightbox functionality

### Security Considerations

1. **Authentication**: Secure admin login with hashed passwords
2. **Authorization**: Route-level protection for admin areas
3. **File Upload**: Validation of file types and sizes
4. **Database**: Parameterized queries through Prisma
5. **Environment Variables**: Sensitive data stored in environment variables

### Deployment Checklist

1. Set up NeonDB database
2. Configure Vercel Blob Storage
3. Set environment variables
4. Run database migrations
5. Seed initial data
6. Deploy to Vercel

### Next Steps for Implementation

1. Install dependencies
2. Set up database schema and migrations
3. Implement authentication system
4. Create admin panel UI components
5. Implement CRUD operations
6. Set up file upload system
7. Update main page to display categorized content
8. Test all functionality
9. Deploy to production

This comprehensive plan provides a solid foundation for building a professional admin panel for your photography website.