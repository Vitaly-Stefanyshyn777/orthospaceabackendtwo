import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GalleryPairsService } from "../gallery/gallery-pairs.service";

@Controller("public/gallery")
export class PublicGalleryController {
  constructor(
    private prisma: PrismaService,
    private pairsService: GalleryPairsService
  ) {}

  @Get("albums")
  listAlbums() {
    return this.prisma.album.findMany({ orderBy: { createdAt: "desc" } });
  }

  @Get("albums/:slug")
  async getBySlug(@Param("slug") slug: string, @Query("tag") tag?: string) {
    const album = await this.prisma.album.findUnique({ where: { slug } });
    if (!album) return null;

    const where: any = { albumId: album.id };
    if (tag) {
      where.tag = tag;
    }

    const photos = await this.prisma.galleryPhoto.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Отримати пари з повною інформацією про фото
    const pairs = await this.pairsService.getPairsWithPhotos(album.id);

    // Отримати колекції
    const collections = await this.pairsService.getCollections(album.id);

    return { album, photos, pairs, collections };
  }
}
