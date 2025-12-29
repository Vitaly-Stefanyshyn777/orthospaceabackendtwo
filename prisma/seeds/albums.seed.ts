import { AlbumType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedAlbums() {
  const albums = [
    { name: "General", slug: "general", type: AlbumType.GENERAL },
    {
      name: "Before & After",
      slug: "before-after",
      type: AlbumType.BEFORE_AFTER,
    },
  ];

  for (const album of albums) {
    await prisma.album.upsert({
      where: { slug: album.slug },
      update: album,
      create: album,
    });
  }
}


