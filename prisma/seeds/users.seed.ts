import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function seedUsers() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("R3k0gr1n1k@Admin#2024", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin",
    },
  });

  console.log("Admin user created:", admin);
}