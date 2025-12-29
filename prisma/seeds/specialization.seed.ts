import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedSpecialization() {
  console.log('🦷 Seeding Specialization...');

  const specialization = await prisma.specialization.upsert({
    where: { id: 1 }, // Since we only have one specialization record
    update: {},
    create: {
      title: "Наша спеціалізація",
      subtitle: "Комплексні стоматологічні послуги для всієї родини",
      description: "Ми спеціалізуємося на всіх напрямках стоматології: терапія, ортопедія, ортодонтія, хірургія, імплантація та професійна гігієна. Наша клініка оснащена сучасним обладнанням, що дозволяє проводити лікування на найвищому рівні.",
      image: "https://via.placeholder.com/800x400/50C878/FFFFFF?text=Our+Specialization",
      imagePublicId: "placeholder-specialization",
    },
  });

  console.log('✅ Specialization seeded successfully');
}
