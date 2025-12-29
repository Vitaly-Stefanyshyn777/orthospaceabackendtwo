import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedAboutUs() {
  console.log('🏥 Seeding AboutUs...');

  const aboutUs = await prisma.aboutUs.upsert({
    where: { id: 1 }, // Since we only have one about us record
    update: {},
    create: {
      title: "Про OrthoSpace",
      subtitle: "Сучасна стоматологічна клініка в центрі Долини",
      description: "OrthoSpace - це сучасна стоматологічна клініка, яка поєднує в собі найновітніші технології та індивідуальний підхід до кожного пацієнта. Наша команда професіоналів гарантує високий рівень обслуговування та найкращі результати лікування.",
      image: "https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=About+OrthoSpace",
      imagePublicId: "placeholder-about",
    },
  });

  console.log('✅ AboutUs seeded successfully');
}
