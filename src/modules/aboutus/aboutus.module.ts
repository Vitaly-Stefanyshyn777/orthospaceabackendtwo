import { Module } from "@nestjs/common";
import { AboutUsController } from "./aboutus.controller";
import { AboutUsService } from "./aboutus.service";
import { PrismaModule } from "../prisma/prisma.module";
import { UploadModule } from "../upload/upload.module";

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [AboutUsController],
  providers: [AboutUsService],
  exports: [AboutUsService],
})
export class AboutUsModule {}
