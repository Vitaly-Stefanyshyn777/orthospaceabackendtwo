import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  Album,
  AlbumType,
  BeforeAfterPair,
  GalleryPhoto,
} from "@prisma/client";
import {
  AddPhotoDTO,
  CreateAlbumDTO,
  CreateBeforeAfterPairDTO,
  UpdateAlbumDTO,
  UpdatePhotoDTO,
} from "./gallery.dto";
import { GalleryPairsService } from "./gallery-pairs.service";

@Injectable()
export class GalleryService {
  constructor(
    private prisma: PrismaService,
    private pairsService: GalleryPairsService
  ) {}

  // Albums
  public listAlbums(): Promise<Album[]> {
    return this.prisma.album.findMany({ orderBy: { createdAt: "desc" } });
  }

  public getAlbum(id: number): Promise<Album | null> {
    return this.prisma.album.findUnique({ where: { id } });
  }

  public async createAlbum(dto: CreateAlbumDTO): Promise<Album> {
    return this.prisma.album.create({ data: dto });
  }

  public async updateAlbum(id: number, dto: UpdateAlbumDTO): Promise<Album> {
    await this.ensureAlbum(id);
    return this.prisma.album.update({ where: { id }, data: dto });
  }

  public async deleteAlbum(id: number): Promise<void> {
    await this.ensureAlbum(id);
    await this.prisma.album.delete({ where: { id } });
  }

  // Photos
  public listPhotos(albumId: number, tag?: string): Promise<GalleryPhoto[]> {
    const where: any = { albumId };
    if (tag) {
      where.tag = tag;
    }

    return this.prisma.galleryPhoto.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  public async addPhoto(dto: AddPhotoDTO): Promise<GalleryPhoto> {
    await this.ensureAlbum(dto.albumId);
    const photo = await this.prisma.galleryPhoto.create({ data: dto });

    // Автоматично створюємо пари для альбому "До/Після"
    const album = await this.prisma.album.findUnique({
      where: { id: dto.albumId },
    });
    if (album?.type === AlbumType.BEFORE_AFTER) {
      await this.pairsService.createPairsAutomatically(dto.albumId);
    }

    return photo;
  }

  public async updatePhoto(
    id: number,
    dto: UpdatePhotoDTO
  ): Promise<GalleryPhoto> {
    await this.ensurePhoto(id);
    return this.prisma.galleryPhoto.update({ where: { id }, data: dto });
  }

  public async deletePhoto(id: number): Promise<void> {
    await this.ensurePhoto(id);

    // Отримати інформацію про фото перед видаленням
    const photo = await this.prisma.galleryPhoto.findUnique({ where: { id } });
    const album = await this.prisma.album.findUnique({
      where: { id: photo.albumId },
    });

    await this.prisma.galleryPhoto.delete({ where: { id } });

    // Пересоздати пари після видалення фото
    if (album?.type === AlbumType.BEFORE_AFTER) {
      await this.pairsService.createPairsAutomatically(photo.albumId);
    }
  }

  // Before/After Pairs
  public listPairs(albumId: number): Promise<BeforeAfterPair[]> {
    return this.prisma.beforeAfterPair.findMany({
      where: { albumId },
      orderBy: { createdAt: "desc" },
    });
  }

  public async createPair(
    dto: CreateBeforeAfterPairDTO
  ): Promise<BeforeAfterPair> {
    await this.ensureAlbum(dto.albumId);
    await this.ensurePhoto(dto.beforePhotoId);
    await this.ensurePhoto(dto.afterPhotoId);
    return this.prisma.beforeAfterPair.create({ data: dto });
  }

  public async deletePair(id: number): Promise<void> {
    await this.ensurePair(id);
    await this.prisma.beforeAfterPair.delete({ where: { id } });
  }

  // Helpers
  private async ensureAlbum(id: number): Promise<void> {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException("Album not found");
  }

  private async ensurePhoto(id: number): Promise<void> {
    const photo = await this.prisma.galleryPhoto.findUnique({ where: { id } });
    if (!photo) throw new NotFoundException("Photo not found");
  }

  private async ensurePair(id: number): Promise<void> {
    const pair = await this.prisma.beforeAfterPair.findUnique({
      where: { id },
    });
    if (!pair) throw new NotFoundException("Pair not found");
  }

  public async recreatePairs(albumId: number): Promise<void> {
    await this.ensureAlbum(albumId);
    await this.pairsService.createPairsAutomatically(albumId);
  }

  public async deleteCollection(
    albumId: number,
    collectionId: number,
    deletePhotos: boolean = true
  ): Promise<{ deletedPairs: number; deletedPhotos: number }> {
    await this.ensureAlbum(albumId);
    return this.pairsService.deleteCollection(
      albumId,
      collectionId,
      deletePhotos
    );
  }

  public async getPairsByCollection(albumId: number, collectionId: number) {
    await this.ensureAlbum(albumId);
    return this.pairsService.getPairsByCollection(albumId, collectionId);
  }

  public async getPairs(albumId: number) {
    await this.ensureAlbum(albumId);
    return this.pairsService.getPairsWithPhotos(albumId);
  }
}
