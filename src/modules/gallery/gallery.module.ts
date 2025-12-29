import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { GalleryService } from "./gallery.service";
import { GalleryController } from "./gallery.controller";
import { GalleryPairsService } from "./gallery-pairs.service";

@Module({
  imports: [PrismaModule],
  controllers: [GalleryController],
  providers: [GalleryService, GalleryPairsService],
})
export class GalleryModule {}
