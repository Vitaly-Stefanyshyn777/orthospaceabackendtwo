import { Module } from "@nestjs/common";
import { SpecializationController } from "./specialization.controller";
import { SpecializationService } from "./specialization.service";
import { PrismaModule } from "../prisma/prisma.module";
import { UploadModule } from "../upload/upload.module";

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [SpecializationController],
  providers: [SpecializationService],
  exports: [SpecializationService],
})
export class SpecializationModule {}
