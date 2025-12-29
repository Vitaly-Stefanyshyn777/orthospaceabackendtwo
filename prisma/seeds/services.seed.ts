import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedServices() {
  console.log('🦷 Seeding services...');

  // Створюємо категорії послуг
  const categoriesData = [
    {
      categoryId: '01',
      mainTitle: 'Обстеження',
      priceRange: '100-500 ГРН',
      order: 1,
      services: [
        { name: 'Консультація', price: '500.00', order: 1 },
        { name: 'Консультація + діагностика', price: '1000.00', order: 2 },
        { name: 'Консультація + план лікування', price: '300.00', order: 3 },
        { name: 'Прицільна рентгенографія', price: '100.00', order: 4 },
        { name: 'Знеболення', price: '200.00', order: 5 },
        { name: 'Надання допомоги при гострому болю', price: '400.00', order: 6 },
        { name: 'Нормо-година лікаря стоматолога', price: '400.00', order: 7 },
      ]
    },
    {
      categoryId: '02',
      mainTitle: 'Професійна Гігієна Зубів',
      priceRange: '700-3000 ГРН',
      order: 2,
      services: [
        { name: 'Професійна гігієна ротової порожнини', price: '1400.00', order: 1 },
        { name: 'Професійна гігієна ротової порожнини ускладнена', price: '1700.00', order: 2 },
        { name: 'Зняття зубних відкладень апаратом Air-Floy', price: '1000.00', order: 3 },
        { name: 'Ультразвукове зняття зубних відкладень', price: '500.00', order: 4 },
        { name: 'Фотовідбілювання зубних рядів', price: '3000.00', order: 5 },
        { name: 'Дитяча проф.гігієга порожнини рота', price: '700.00', order: 6 },
      ]
    },
    {
      categoryId: '03',
      mainTitle: 'Терапія',
      priceRange: '1400-2000 ГРН',
      order: 3,
      services: [
        { name: 'Реставрація фронтальної групи зубів (1 поверхні)', price: '1600.00', order: 1 },
        { name: 'Реставрація фронтальної групи зубів (2поверхні)', price: '1800.00', order: 2 },
        { name: 'Виготовлення силіконового ключа', price: '400.00', order: 3 },
        { name: 'Реставрація жувальної групи зубів', price: '1300.00 - 1600.00', order: 4 },
        { name: 'Реставрація фронтальної групи зубів з ураження ріжучого краю', price: '3000.00', order: 5 },
        { name: 'Моделювання культі зуба під коронку', price: '900.00', order: 6 },
        { name: 'Реставрація фронтальної групи зубів з восковим моделюванням', price: '2500.00', order: 7 },
      ]
    }
  ];

  for (const categoryData of categoriesData) {
    const category = await prisma.serviceCategory.upsert({
      where: { categoryId: categoryData.categoryId },
      update: {},
      create: {
        categoryId: categoryData.categoryId,
        mainTitle: categoryData.mainTitle,
        priceRange: categoryData.priceRange,
        order: categoryData.order,
      },
    });

    for (const serviceData of categoryData.services) {
      // Перевіряємо, чи існує послуга
      const existingService = await prisma.service.findFirst({
        where: {
          categoryId: category.id,
          name: serviceData.name,
        },
      });

      if (!existingService) {
        await prisma.service.create({
          data: {
            categoryId: category.id,
            type: 'Tooth',
            name: serviceData.name,
            price: serviceData.price,
            order: serviceData.order,
            isActive: true,
          },
        });
      }
    }
  }

  console.log('✅ Services seeded successfully');
}
