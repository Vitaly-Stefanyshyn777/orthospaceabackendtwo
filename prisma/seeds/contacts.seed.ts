import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedContacts() {
  console.log('🌱 Seeding contacts...');

  // Create contact info
  const contactInfo = await prisma.contactInfo.upsert({
    where: { id: 1 }, // Since we only have one contact info record
    update: {},
    create: {
      title: "Зв'яжіться з нами",
      description: "Залишіть нам заявку, і наш спеціаліст зв'яжеться з вами протягом години, щоб обговорити деталі та провести безкоштовний огляд.",
      phone: "050 511 5810",
      workHours: {
        weekdays: "Пн-Пт",
        weekdayHours: "08:00 - 20:00",
        weekend: "Сб-Нд",
        weekendHours: "09:00 - 18:00"
      },
      socialLinks: [
        {
          facebook: "https://facebook.com/orthospace",
          instagram: "https://instagram.com/orthospace",
          telegram: "https://t.me/orthospace",
          viber: "viber://chat?number=%2B380505115810"
        }
      ]
    },
  });

  // Create location info
  const locationInfo = await prisma.locationInfo.upsert({
    where: { id: 1 }, // Since we only have one location info record
    update: {},
    create: {
      title: "Де нас знайти?",
      description: "У OrthoSpace ви знайдете не просто стоматологію, а команду, яка слухає, підтримує й лікує з турботою.",
      address: "м. Долина, вул. Обліски 115В",
      phone: "050 511 5810",
      viberLink: "viber://chat?number=%2B380505115810",
      telegramLink: "https://t.me/orthospace"
    },
  });

  console.log('✅ Contacts seeded successfully');
}

