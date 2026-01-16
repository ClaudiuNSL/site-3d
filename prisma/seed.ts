import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await hash('ionut@33', 12)

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

  // Create all categories with icons and subtitles
  const categories = [
    {
      name: 'Nuntă',
      slug: 'nunta',
      subtitle: 'O zi, o viață de amintiri',
      icon: '💍',
      description: 'Într-o zi, două suflete spun "da" pentru totdeauna. Nunta nu este doar un eveniment – este începutul unei povești de dragoste care va dura toată viața.',
      order: 0,
    },
    {
      name: 'Botez',
      slug: 'botez',
      subtitle: 'Magia începuturilor',
      icon: '👶',
      description: 'Sunt zile care trec și zile care rămân în suflet pentru totdeauna. Prima băiță în cristelniță, primele priviri pline de nevinovăție, zâmbetele celor dragi – toate aceste momente merită păstrate pentru eternitate.',
      order: 1,
    },
    {
      name: 'Save the Date',
      slug: 'save-date',
      subtitle: 'Primul capitol din povestea voastră de nuntă',
      icon: '📅',
      description: 'Totul începe cu o întrebare și un "da" spus din inimă. Urmează planuri, visuri, idei și acea emoție unică de a anunța lumii întregii că vă pregătiți să faceți cel mai important pas din viața voastră.',
      order: 2,
    },
    {
      name: 'Cuplu',
      slug: 'cuplu',
      subtitle: 'Iubirea în fiecare cadru',
      icon: '💑',
      description: 'Fiecare cuplu are povestea lui unică. Lasă-mă să surprind legătura specială dintre voi, zâmbetele complice și gesturile care vorbesc despre dragoste.',
      order: 3,
    },
    {
      name: 'Familie',
      slug: 'familie',
      subtitle: 'Momente prețioase împreună',
      icon: '👨‍👩‍👧‍👦',
      description: 'Familia este cel mai mare comori. Păstrează aceste momente speciale petrecute împreună într-o colecție de fotografii pline de căldură și iubire.',
      order: 4,
    },
    {
      name: 'Trash the Dress',
      slug: 'trash-dress',
      subtitle: 'Aventură după nuntă',
      icon: '👰',
      description: 'Rochia de mireasă a îndeplinit deja rolul ei magic. Acum este timpul pentru o sesiune foto creativă, plină de spontaneitate și libertate.',
      order: 5,
    },
    {
      name: 'Absolvire',
      slug: 'absolvire',
      subtitle: 'Încheierea unui capitol, începutul altuia',
      icon: '🎓',
      description: 'Absolvirea este un moment de mândrie și realizare. Surprinde această etapă importantă din viața ta cu fotografii profesionale.',
      order: 6,
    },
    {
      name: 'Profesional',
      slug: 'profesional',
      subtitle: 'Imaginea ta profesională',
      icon: '💼',
      description: 'Prima impresie contează. Fotografii profesionale pentru CV, LinkedIn, sau website-ul companiei tale.',
      order: 7,
    },
    {
      name: 'Fotografii amuzante',
      slug: 'amuzante',
      subtitle: 'Distracție și creativitate',
      icon: '🎭',
      description: 'Uneori, cele mai bune amintiri sunt cele în care râdem cu lacrimi. Sesiuni foto creative și distractive pentru orice ocazie.',
      order: 8,
    },
  ]

  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        subtitle: category.subtitle,
        icon: category.icon,
        description: category.description,
        order: category.order,
      },
      create: category,
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