const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const adminEmail = "admin@rekogrinik.com";
    
    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (admin) {
      console.log("✅ Адмін знайдений в базі даних:");
      console.log("📧 Email:", admin.email);
      console.log("👤 Name:", admin.name);
      console.log("🆔 ID:", admin.id);
      console.log("🔐 Password hash:", admin.password.substring(0, 30) + "...");
      console.log("📅 Created:", admin.createdAt);
    } else {
      console.log("❌ Адмін не знайдений в базі даних");
    }
  } catch (error) {
    console.error("❌ Помилка:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();










