import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await hash('admin123@', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'costinfoto@gmail.com' },
    update: {},
    create: {
      email: 'costinfoto@gmail.com',
      password: hashedPassword,
      name: 'Baciu Costin',
      role: 'ADMIN'
    }
  })

  console.log('Created admin user:', admin)

  // Create default categories
  const categories = [
    { name: 'Nuntă', slug: 'nunta', description: 'Fotografii de nuntă' },
    { name: 'Botez', slug: 'botez', description: 'Fotografii de botez' },
    { name: 'Cuplu', slug: 'cuplu', description: 'Fotografii de cuplu' },
    { name: 'Familie', slug: 'familie', description: 'Fotografii de familie' },
    { name: 'Fotografii amuzante', slug: 'amuzante', description: 'Fotografii amuzante și spontane' },
    { name: 'Save the Date', slug: 'save-date', description: 'Fotografii Save the Date' },
    { name: 'Trash the Dress', slug: 'trash-dress', description: 'Sesiuni foto Trash the Dress' },
    { name: 'Absolvire', slug: 'absolvire', description: 'Fotografii de absolvire' },
    { name: 'Profesional', slug: 'profesional', description: 'Fotografii profesionale' }
  ]

  for (const [index, category] of categories.entries()) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        ...category,
        order: index
      }
    })
    console.log('Created category:', createdCategory)
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