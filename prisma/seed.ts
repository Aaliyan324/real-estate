import { PrismaClient, Role, PropertyPurpose, PropertyType, AreaUnit, FurnishingStatus, PropertyStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding initial data for PakHaven Real Estate...')

  // Create Admin User
  const adminPassword = await bcrypt.hash('AdminPass123!', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pakhaven.pk' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@pakhaven.pk',
      password: adminPassword,
      role: Role.ADMIN,
      phone: '+92 300 1234567',
    },
  })

  // Create Agent User & Agent Profile 1
  const agent1Password = await bcrypt.hash('AgentPass123!', 10)
  const agent1User = await prisma.user.upsert({
    where: { email: 'aaliyan@pakhaven.pk' },
    update: {},
    create: {
      name: 'Muhammad Aaliyan',
      email: 'aaliyan@pakhaven.pk',
      password: agent1Password,
      role: Role.AGENT,
      phone: '+92 300 9876543',
    },
  })

  const agent1 = await prisma.agent.upsert({
    where: { slug: 'muhammad-aaliyan' },
    update: {},
    create: {
      userId: agent1User.id,
      name: 'Muhammad Aaliyan',
      slug: 'muhammad-aaliyan',
      email: 'aaliyan@pakhaven.pk',
      phone: '+92 300 9876543',
      whatsapp: '923009876543',
      agency: 'Aaliyan Real Estate & Builders',
      bio: 'Leading real estate consultant in DHA Lahore with over 8 years of experience in luxury residential and commercial properties.',
      isVerified: true,
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
    },
  })

  // Create Agent Profile 2
  const agent2User = await prisma.user.upsert({
    where: { email: 'zainab.khan@pakhaven.pk' },
    update: {},
    create: {
      name: 'Zainab Khan',
      email: 'zainab.khan@pakhaven.pk',
      password: agent1Password,
      role: Role.AGENT,
      phone: '+92 312 5554321',
    },
  })

  const agent2 = await prisma.agent.upsert({
    where: { slug: 'zainab-khan' },
    update: {},
    create: {
      userId: agent2User.id,
      name: 'Zainab Khan',
      slug: 'zainab-khan',
      email: 'zainab.khan@pakhaven.pk',
      phone: '+92 312 5554321',
      whatsapp: '923125554321',
      agency: 'Capital Haven Properties',
      bio: 'Specializing in Islamabad CDA sectors, Gulberg Greens, and Bahria Town residential plots and apartments.',
      isVerified: true,
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    },
  })

  // Sample Properties
  const propertiesData = [
    {
      title: '1 Kanal Luxury Modern Villa in DHA Phase 6 Lahore',
      slug: '1-kanal-luxury-modern-villa-dha-phase-6-lahore',
      description: 'Brand new state of the art 1 Kanal designer house available for sale in DHA Phase 6 Lahore. Featuring spanish tile flooring, imported bath fittings, full basement, 5 master bedrooms, clean Italian kitchen, beautiful lawn and ample car parking space.',
      purpose: PropertyPurpose.FOR_SALE,
      propertyType: PropertyType.HOUSE,
      price: 85000000, // PKR 8.5 Crore
      city: 'Lahore',
      area: 'DHA Phase 6',
      society: 'DHA',
      address: 'Block MB, DHA Phase 6, Lahore',
      bedrooms: 5,
      bathrooms: 6,
      areaSize: 1,
      areaUnit: AreaUnit.KANAL,
      furnishing: FurnishingStatus.SEMI_FURNISHED,
      parking: true,
      isFeatured: true,
      isVerified: true,
      status: PropertyStatus.PUBLISHED,
      latitude: 31.4697,
      longitude: 74.4503,
      agentId: agent1.id,
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80'
      ],
      features: ['Electricity', 'Gas', 'Water Supply', 'Security Staff', 'Balcony', 'Lawn', 'Car Parking', 'Servant Quarter'],
    },
    {
      title: '5 Marla Brand New House for Sale in Bahria Town Lahore',
      slug: '5-marla-brand-new-house-bahria-town-lahore',
      description: 'Beautifully designed 5 Marla triple story house for sale in Sector C, Bahria Town Lahore. Close to Eiffel Tower park, school, and commercial market. 3 bedrooms with attached baths, 2 kitchens, TV lounge, and rooftop terrace.',
      purpose: PropertyPurpose.FOR_SALE,
      propertyType: PropertyType.HOUSE,
      price: 24500000, // PKR 2.45 Crore
      city: 'Lahore',
      area: 'Bahria Town Sector C',
      society: 'Bahria Town',
      address: 'Nargis Block, Sector C, Bahria Town, Lahore',
      bedrooms: 3,
      bathrooms: 4,
      areaSize: 5,
      areaUnit: AreaUnit.MARLA,
      furnishing: FurnishingStatus.UNFURNISHED,
      parking: true,
      isFeatured: true,
      isVerified: true,
      status: PropertyStatus.PUBLISHED,
      latitude: 31.3681,
      longitude: 74.1866,
      agentId: agent1.id,
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80',
      ],
      features: ['Electricity', 'Gas', '24/7 Security', 'Car Parking', 'Near Mosque', 'Near Park'],
    },
    {
      title: '3 Bedroom Luxury Apartment for Rent in F-11 Islamabad',
      slug: '3-bedroom-luxury-apartment-for-rent-f-11-islamabad',
      description: 'Fully furnished 3 bedroom luxury apartment available for monthly rent in Silver Oaks Apartments F-11 Islamabad. Panoramic Margalla Hills view, gym, swimming pool, standby generator, and reserved basement parking.',
      purpose: PropertyPurpose.FOR_RENT,
      propertyType: PropertyType.APARTMENT,
      price: 220000, // PKR 2.2 Lakh per month
      city: 'Islamabad',
      area: 'F-11 Markaz',
      society: 'CDA Sectors',
      address: 'Silver Oaks Towers, F-11, Islamabad',
      bedrooms: 3,
      bathrooms: 3,
      areaSize: 2200,
      areaUnit: AreaUnit.SQFT,
      furnishing: FurnishingStatus.FURNISHED,
      parking: true,
      isFeatured: true,
      isVerified: true,
      status: PropertyStatus.PUBLISHED,
      latitude: 33.6844,
      longitude: 72.9886,
      agentId: agent2.id,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
      ],
      features: ['Elevator', 'Standby Generator', 'Swimming Pool', 'Gym', 'Balcony', 'Covered Parking', '24/7 Security'],
    },
    {
      title: '10 Marla Residential Plot for Sale in Gulberg Greens Islamabad',
      slug: '10-marla-residential-plot-gulberg-greens-islamabad',
      description: 'Prime location 10 Marla residential plot available in Executive Block, Gulberg Greens Islamabad. Ready for construction with all utility connection NOCs issued.',
      purpose: PropertyPurpose.FOR_SALE,
      propertyType: PropertyType.PLOT,
      price: 18500000, // PKR 1.85 Crore
      city: 'Islamabad',
      area: 'Gulberg Greens',
      society: 'Gulberg Greens',
      address: 'Executive Block, Gulberg Greens, Islamabad',
      bedrooms: 0,
      bathrooms: 0,
      areaSize: 10,
      areaUnit: AreaUnit.MARLA,
      furnishing: FurnishingStatus.UNFURNISHED,
      parking: false,
      isFeatured: false,
      isVerified: true,
      status: PropertyStatus.PUBLISHED,
      latitude: 33.5984,
      longitude: 73.1568,
      agentId: agent2.id,
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
      ],
      features: ['Electricity', 'Gas', 'Sewerage', 'Wide Roads', 'Gated Community'],
    },
    {
      title: 'Commercial Sea View Office Space in Clifton Block 4 Karachi',
      slug: 'commercial-sea-view-office-space-clifton-block-4-karachi',
      description: 'Spacious 1800 Sq Ft modern office hall with meeting rooms and sea view terrace in Clifton Block 4 Karachi. Ideal for corporate IT firms, real estate agencies, and multinational offices.',
      purpose: PropertyPurpose.FOR_RENT,
      propertyType: PropertyType.OFFICE,
      price: 350000, // PKR 3.5 Lakh / month
      city: 'Karachi',
      area: 'Clifton Block 4',
      society: 'Clifton',
      address: 'Marine Financial Tower, Clifton Block 4, Karachi',
      bedrooms: 0,
      bathrooms: 2,
      areaSize: 1800,
      areaUnit: AreaUnit.SQFT,
      furnishing: FurnishingStatus.SEMI_FURNISHED,
      parking: true,
      isFeatured: true,
      isVerified: true,
      status: PropertyStatus.PUBLISHED,
      latitude: 24.8238,
      longitude: 67.0289,
      agentId: agent1.id,
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
      ],
      features: ['Elevator', '24/7 Security', 'Standby Generator', 'High Speed Internet', 'Reserved Parking'],
    },
    {
      title: '4 Kanal Luxury Farmhouse in Bedian Road Lahore',
      slug: '4-kanal-luxury-farmhouse-bedian-road-lahore',
      description: 'Exquisite 4 Kanal private farmhouse featuring swimming pool, landscaped lawn, fruit orchard, 4 bedroom villa, and servant quarters. Perfect retreat located 10 mins from Ring Road.',
      purpose: PropertyPurpose.FOR_SALE,
      propertyType: PropertyType.FARM_HOUSE,
      price: 135000000, // PKR 13.5 Crore
      city: 'Lahore',
      area: 'Bedian Road',
      society: 'Bedian Country Club',
      address: 'Main Bedian Road, Lahore',
      bedrooms: 4,
      bathrooms: 5,
      areaSize: 4,
      areaUnit: AreaUnit.KANAL,
      furnishing: FurnishingStatus.FURNISHED,
      parking: true,
      isFeatured: true,
      isVerified: true,
      status: PropertyStatus.PUBLISHED,
      latitude: 31.4201,
      longitude: 74.4988,
      agentId: agent1.id,
      images: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80',
      ],
      features: ['Swimming Pool', 'Large Lawn', 'Fruit Orchard', 'Solar System', 'CCTV Security', 'Boundary Wall'],
    },
  ]

  for (const prop of propertiesData) {
    const { images, features, ...propFields } = prop
    const createdProperty = await prisma.property.upsert({
      where: { slug: propFields.slug },
      update: {},
      create: {
        ...propFields,
        images: {
          create: images.map((url, index) => ({
            url,
            isMain: index === 0,
            sortOrder: index,
          })),
        },
        features: {
          create: features.map((name) => ({ name })),
        },
      },
    })
    console.log(`Created property: ${createdProperty.title}`)
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
