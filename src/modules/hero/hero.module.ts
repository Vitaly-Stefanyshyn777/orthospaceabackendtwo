import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { UploadModule } from "../upload/upload.module";
import { HeroService } from "./hero.service";
import { HeroController } from "./hero.controller";

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [HeroController],
  providers: [HeroService],
  exports: [HeroService],
})
export class HeroModule {}


