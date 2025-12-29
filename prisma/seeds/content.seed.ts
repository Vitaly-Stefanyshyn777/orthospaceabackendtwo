import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedContent() {
  const blocks = [
    { blockNumber: 1, name: "header", text: "" },
    { blockNumber: 2, name: "hero", text: "" },
    { blockNumber: 3, name: "stats", text: "" },
    { blockNumber: 4, name: "services", text: "" },
    { blockNumber: 5, name: "workstages", text: "" },
    { blockNumber: 6, name: "testimonials", text: "" },
    { blockNumber: 7, name: "gallery", text: "" },
    { blockNumber: 8, name: "faq", text: "" },
    { blockNumber: 9, name: "about", text: "" },
  ];

  for (const block of blocks) {
    await prisma.contentBlock.upsert({
      where: { blockNumber: block.blockNumber },
      update: block,
      create: block,
    });
  }
}


