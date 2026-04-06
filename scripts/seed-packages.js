const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Delete all existing packages first
  await prisma.package.deleteMany()
  console.log('Deleted all existing packages.')

  const packages = [
    {
      name: 'Nuntă',
      icon: 'fas fa-ring',
      price: 1500,
      currency: 'Euro',
      tier: 'Pachet Basic',
      badge: 'Popular',
      order: 0,
      features: [
        { icon: 'fas fa-camera', text: '1 Fotograf (acasă mirii, biserică, restaurant)' },
        { icon: 'fas fa-video', text: '1 Videograf (acasă mirii, biserică, restaurant)' },
        { icon: 'fas fa-heart', text: 'Ședință foto ziua nunții' },
        { icon: 'fas fa-images', text: 'Fotografii nelimitate, selectate și editate' },
        { icon: 'fas fa-film', text: 'Filmare Full HD 2-3 ore din toată nunta' },
        { icon: 'fas fa-play-circle', text: 'Videoclip prezentare max 2 minute' },
        { icon: 'fas fa-comments', text: 'Consultanță ziua nunții' },
        { icon: 'fas fa-link', text: 'Link valabilitate 6 luni cu fotografiile + filmarea' },
        { icon: 'fas fa-bolt', text: 'Same day edit (20 fotografii editate în ziua evenimentului)' },
      ],
      extras: [
        { text: 'Second shooter acasă nașii, biserică, restaurant', price: '350 €' },
        { text: 'Second videograf acasă nașii, biserică, restaurant', price: '350 €' },
        { text: 'Ședință foto Save the Date', price: '150 €' },
        { text: 'Ședință foto Trash the Dress', price: '200 €' },
        { text: 'Stick 128 GB calitate 2.3 în carcasă personalizată', price: '30 €' },
        { text: 'Album foto carte 40 pag / 20 colaje, 30x30 cm', price: '180 €' },
        { text: 'Album foto carte 30 pag / 15 colaje, 20x20 cm', price: '100 €' },
        { text: 'Fotografii dronă', price: '100 €' },
        { text: 'Filmare dronă ziua nunții (unde permite zborul)', price: '100 €' },
      ],
      notes: [
        { icon: 'fas fa-clock', text: 'Predarea materialelor: 80 zile lucrătoare' },
        { icon: 'fas fa-file-signature', text: 'Rezervare: contract + avans 30%' },
        { icon: 'fas fa-map-marker-alt', text: 'În afara Constanței: transport/cazare de comun acord' },
      ],
    },
    {
      name: 'Botez',
      icon: 'fas fa-baby',
      price: 400,
      currency: 'Euro',
      tier: 'Pachet Basic',
      badge: null,
      order: 1,
      features: [
        { icon: 'fas fa-camera', text: '1 Fotograf (acasă copil, biserică)' },
        { icon: 'fas fa-video', text: '1 Videograf (acasă copil, biserică)' },
        { icon: 'fas fa-baby', text: 'Ședință foto ziua botezului' },
        { icon: 'fas fa-images', text: 'Fotografii nelimitate, selectate și editate' },
        { icon: 'fas fa-film', text: 'Filmare Full HD (selecție, editare) 1-2 ore' },
        { icon: 'fas fa-play-circle', text: 'Videoclip prezentare max 2 minute' },
        { icon: 'fas fa-comments', text: 'Consultanță ziua botezului' },
        { icon: 'fas fa-link', text: 'Link valabilitate 6 luni cu fotografiile + filmarea' },
        { icon: 'fas fa-bolt', text: 'Same day edit (20 fotografii editate în ziua evenimentului)' },
      ],
      extras: [
        { text: 'Fotograf acasă', price: '200 €' },
        { text: 'Videograf acasă', price: '200 €' },
        { text: 'Fotograf biserică', price: '200 €' },
        { text: 'Videograf biserică', price: '200 €' },
        { text: 'Fotograf restaurant durată 3 ore', price: '200 €' },
        { text: 'Videograf restaurant durată 3 ore', price: '200 €' },
        { text: 'Stick 128 GB calitate 2.3 în carcasă personalizată', price: '30 €' },
        { text: 'Album foto carte 30 pag / 15 colaje, 20x20 cm', price: '80 €' },
        { text: 'Fotografii dronă', price: '100 €' },
        { text: 'Filmare dronă ziua botez (unde permite zborul)', price: '100 €' },
      ],
      notes: [
        { icon: 'fas fa-clock', text: 'Predarea materialelor: 60 zile lucrătoare' },
        { icon: 'fas fa-file-signature', text: 'Rezervare: contract + avans 30%' },
        { icon: 'fas fa-exclamation-circle', text: 'Ora maximă 23:30 — peste această oră: 100 €/h' },
        { icon: 'fas fa-map-marker-alt', text: 'În afara Constanței: transport/cazare de comun acord' },
      ],
    },
    {
      name: 'Cununie Civilă',
      icon: 'fas fa-heart',
      price: 350,
      currency: 'Euro',
      tier: 'Pachet Basic',
      badge: null,
      order: 2,
      features: [
        { icon: 'fas fa-camera', text: '1 Fotograf (casa căsătoriilor)' },
        { icon: 'fas fa-video', text: '1 Videograf (casa căsătoriilor)' },
        { icon: 'fas fa-heart', text: 'Ședință foto casa căsătoriilor' },
        { icon: 'fas fa-images', text: 'Fotografii nelimitate, selectate și editate' },
        { icon: 'fas fa-film', text: 'Filmare Full HD (selecție, editare) 10-20 minute' },
        { icon: 'fas fa-play-circle', text: 'Videoclip prezentare max 2 minute' },
        { icon: 'fas fa-link', text: 'Link valabilitate 6 luni cu fotografiile + filmarea' },
        { icon: 'fas fa-bolt', text: 'Same day edit (20 fotografii editate în ziua evenimentului)' },
      ],
      extras: [
        { text: 'Fotograf casa căsătoriilor', price: '200 €' },
        { text: 'Videograf casa căsătoriilor', price: '200 €' },
        { text: 'Ședință foto', price: '200 €' },
        { text: 'Fotograf restaurant durată 3 ore', price: '200 €' },
        { text: 'Videograf restaurant durată 3 ore', price: '200 €' },
        { text: 'Stick 128 GB calitate 2.3 în carcasă', price: '30 €' },
        { text: 'Album foto carte 30 pag, 20x20 cm', price: '80 €' },
        { text: 'Filmare dronă (unde permite zborul)', price: '100 €' },
      ],
      notes: [
        { icon: 'fas fa-clock', text: 'Predarea materialelor: 50 zile lucrătoare' },
        { icon: 'fas fa-file-signature', text: 'Rezervare: contract + avans 30%' },
        { icon: 'fas fa-map-marker-alt', text: 'În afara Constanței: transport/cazare de comun acord' },
      ],
    },
    {
      name: 'Majorat',
      icon: 'fas fa-glass-cheers',
      price: 450,
      currency: 'Euro',
      tier: 'Pachet Basic',
      badge: null,
      order: 3,
      features: [
        { icon: 'fas fa-camera', text: '1 Fotograf (restaurant max ora 24:00)' },
        { icon: 'fas fa-video', text: '1 Videograf (restaurant max ora 24:00)' },
        { icon: 'fas fa-star', text: 'Ședință foto ziua evenimentului cu sărbătoritul/a' },
        { icon: 'fas fa-images', text: 'Fotografii nelimitate, selectate și editate' },
        { icon: 'fas fa-film', text: 'Filmare Full HD (selecție, editare) 1-2 ore' },
        { icon: 'fas fa-play-circle', text: 'Videoclip prezentare max 2 minute' },
        { icon: 'fas fa-link', text: 'Link valabilitate 6 luni cu fotografiile + filmarea' },
        { icon: 'fas fa-bolt', text: 'Same day edit (20 fotografii editate în ziua evenimentului)' },
      ],
      extras: [
        { text: 'Ședință foto', price: '200 €' },
        { text: 'Fotograf restaurant durată 3 ore', price: '200 €' },
        { text: 'Videograf restaurant durată 3 ore', price: '200 €' },
        { text: 'Stick 128 GB calitate 2.3 în carcasă', price: '30 €' },
        { text: 'Album foto carte 30 pag / 15 colaje, 20x20 cm', price: '80 €' },
        { text: 'Filmare dronă (unde permite zborul)', price: '100 €' },
      ],
      notes: [
        { icon: 'fas fa-clock', text: 'Predarea materialelor: 50 zile lucrătoare' },
        { icon: 'fas fa-file-signature', text: 'Rezervare: contract + avans 30%' },
        { icon: 'fas fa-map-marker-alt', text: 'În afara Constanței: transport/cazare de comun acord' },
      ],
    },
  ]

  for (const pkg of packages) {
    const created = await prisma.package.create({ data: pkg })
    console.log(`Created package: ${created.name} (id: ${created.id})`)
  }

  console.log('All 4 packages seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding packages:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
