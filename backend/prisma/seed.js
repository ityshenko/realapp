const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tut.ru' },
    update: {},
    create: {
      email: 'admin@tut.ru',
      password: hashedPassword,
      name: 'Администратор',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log('✅ Created admin user: admin@tut.ru / admin123');

  // Create test users
  const users = [];
  const testUsers = [
    { email: 'user1@test.ru', name: 'Иван Петров', phone: '+7 (999) 111-11-11' },
    { email: 'user2@test.ru', name: 'Анна Сидорова', phone: '+7 (999) 222-22-22' },
    { email: 'user3@test.ru', name: 'Сергей Козлов', phone: '+7 (999) 333-33-33' },
  ];

  for (const userData of testUsers) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        role: 'USER',
        isVerified: true,
      },
    });
    users.push(user);
    console.log(`✅ Created user: ${userData.email}`);
  }

  // Create test listings
  const listings = [
    {
      title: '2-к квартира в центре Донецка',
      description: 'Просторная двухкомнатная квартира в центре города с ремонтом. Панорамные окна, встроенная кухня, кондиционер.',
      price: 45000,
      dealType: 'RENT',
      propertyType: 'APARTMENT',
      rooms: 2,
      area: 54,
      floor: 3,
      totalFloors: 9,
      address: 'пр. Пушкина, 10',
      districtNameRu: 'Ворошиловский',
      lat: 48.0083,
      lng: 37.8083,
      hasFurniture: true,
      hasParking: true,
      hasElevator: true,
      ownerId: users[0].id,
      status: 'ACTIVE',
    },
    {
      title: '1-к квартира у парка',
      description: 'Уютная однокомнатная квартира рядом с парком. Тихий двор, развитая инфраструктура.',
      price: 32000,
      dealType: 'RENT',
      propertyType: 'APARTMENT',
      rooms: 1,
      area: 42,
      floor: 4,
      totalFloors: 5,
      address: 'ул. Артема, 25',
      districtNameRu: 'Киевский',
      lat: 48.0333,
      lng: 37.8000,
      hasFurniture: false,
      ownerId: users[1].id,
      status: 'ACTIVE',
    },
    {
      title: 'Дом с участком 10 соток',
      description: 'Частный дом с большим участком в тихом районе. Гараж, сад, все коммуникации.',
      price: 8500000,
      dealType: 'SALE',
      propertyType: 'HOUSE',
      rooms: 4,
      area: 150,
      address: 'пгт. Александровка',
      districtNameRu: 'Будённовский',
      lat: 47.9833,
      lng: 37.8167,
      hasFurniture: true,
      hasParking: true,
      ownerId: users[2].id,
      status: 'ACTIVE',
    },
    {
      title: '3-к квартира просторная',
      description: 'Роскошная трехкомнатная квартира с качественным ремонтом. Премиум жилой комплекс.',
      price: 75000,
      dealType: 'RENT',
      propertyType: 'APARTMENT',
      rooms: 3,
      area: 95,
      floor: 8,
      totalFloors: 12,
      address: 'пр. Ильича, 50',
      districtNameRu: 'Калининский',
      lat: 48.0167,
      lng: 37.7833,
      hasFurniture: true,
      hasElevator: true,
      isNewBuilding: true,
      ownerId: users[0].id,
      status: 'ACTIVE',
    },
    {
      title: 'Участок 12 соток под ИЖС',
      description: 'Ровный земельный участок в тихом районе. Все коммуникации по границе.',
      price: 1800000,
      dealType: 'SALE',
      propertyType: 'LAND',
      area: 1200,
      address: 'пгт. Лидиевка',
      districtNameRu: 'Пролетарский',
      lat: 47.9583,
      lng: 37.8333,
      ownerId: users[1].id,
      status: 'ACTIVE',
    },
  ];

  for (const listingData of listings) {
    const listing = await prisma.listing.create({
      data: {
        ...listingData,
        photos: {
          create: {
            url: '/uploads/listings/default.jpg',
            order: 0,
            isPrimary: true,
          },
        },
      },
    });
    console.log(`✅ Created listing: ${listing.title}`);
  }

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
