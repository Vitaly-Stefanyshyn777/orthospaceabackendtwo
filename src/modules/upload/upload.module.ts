import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { PrismaService } from "../prisma/prisma.service";
import { GalleryPairsService } from "../gallery/gallery-pairs.service";

@Module({
  providers: [UploadService, PrismaService, GalleryPairsService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
