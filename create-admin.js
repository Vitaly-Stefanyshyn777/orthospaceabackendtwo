const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function fixAdmin() {
  try {
    console.log('Перевіряю та виправляю адміністратора...');

    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (!existingAdmin) {
      console.log('Створюю адміністратора...');
      const hashedPassword = await bcrypt.hash('R3k0gr1n1k@Admin#2024', 10);

      const admin = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          password: hashedPassword,
          name: 'Admin',
        },
      });

      console.log('Admin user created:', admin);
    } else {
      console.log('Адміністратор існує, оновлюю пароль...');
      const hashedPassword = await bcrypt.hash('R3k0gr1n1k@Admin#2024', 10);

      const admin = await prisma.user.update({
        where: { email: 'admin@example.com' },
        data: {
          password: hashedPassword,
        },
      });

      console.log('Admin password updated:', admin.email);
    }

  } catch (error) {
    console.error('Помилка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdmin();
