import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.jwt.guard";
import { GalleryService } from "./gallery.service";
import {
  AddPhotoDTO,
  CreateAlbumDTO,
  CreateBeforeAfterPairDTO,
  UpdateAlbumDTO,
  UpdatePhotoDTO,
} from "./gallery.dto";

@Controller("gallery")
@UseGuards(JwtAuthGuard)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  // Albums
  @Get("albums")
  listAlbums() {
    return this.galleryService.listAlbums();
  }

  @Post("albums")
  createAlbum(@Body() dto: CreateAlbumDTO) {
    return this.galleryService.createAlbum(dto);
  }

  @Put("albums/:id")
  updateAlbum(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateAlbumDTO
  ) {
    return this.galleryService.updateAlbum(id, dto);
  }

  @Delete("albums/:id")
  deleteAlbum(@Param("id", ParseIntPipe) id: number) {
    return this.galleryService.deleteAlbum(id);
  }

  // Photos
  @Get("albums/:albumId/photos")
  listPhotos(
    @Param("albumId", ParseIntPipe) albumId: number,
    @Query("tag") tag?: string
  ) {
    return this.galleryService.listPhotos(albumId, tag);
  }

  @Post("photos")
  addPhoto(@Body() dto: AddPhotoDTO) {
    return this.galleryService.addPhoto(dto);
  }

  @Put("photos/:id")
  updatePhoto(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdatePhotoDTO
  ) {
    return this.galleryService.updatePhoto(id, dto);
  }

  @Delete("photos/:id")
  deletePhoto(@Param("id", ParseIntPipe) id: number) {
    return this.galleryService.deletePhoto(id);
  }

  // Before/After Pairs
  @Get("albums/:albumId/pairs")
  listPairs(@Param("albumId", ParseIntPipe) albumId: number) {
    return this.galleryService.listPairs(albumId);
  }

  @Post("pairs")
  createPair(@Body() dto: CreateBeforeAfterPairDTO) {
    return this.galleryService.createPair(dto);
  }

  @Post("albums/:albumId/pairs")
  createPairForAlbum(
    @Param("albumId", ParseIntPipe) albumId: number,
    @Body() dto: { beforePhotoId: number; afterPhotoId: number; label?: string }
  ) {
    return this.galleryService.createPair({
      albumId,
      beforePhotoId: dto.beforePhotoId,
      afterPhotoId: dto.afterPhotoId,
      label: dto.label,
    });
  }

  @Delete("pairs/:id")
  deletePair(@Param("id", ParseIntPipe) id: number) {
    return this.galleryService.deletePair(id);
  }

  @Post("albums/:albumId/recreate-pairs")
  recreatePairs(@Param("albumId", ParseIntPipe) albumId: number) {
    return this.galleryService.recreatePairs(albumId);
  }

  @Delete("albums/:albumId/collections/:collectionId")
  deleteCollection(
    @Param("albumId", ParseIntPipe) albumId: number,
    @Param("collectionId", ParseIntPipe) collectionId: number,
    @Query("deletePhotos") deletePhotos?: string
  ) {
    const shouldDeletePhotos = deletePhotos === "true";
    return this.galleryService.deleteCollection(
      albumId,
      collectionId,
      shouldDeletePhotos
    );
  }

  @Get("albums/:albumId/pairs")
  getPairsByCollection(
    @Param("albumId", ParseIntPipe) albumId: number,
    @Query("collectionId") collectionId?: string
  ) {
    if (collectionId) {
      return this.galleryService.getPairsByCollection(
        albumId,
        parseInt(collectionId)
      );
    }
    return this.galleryService.getPairs(albumId);
  }
}
