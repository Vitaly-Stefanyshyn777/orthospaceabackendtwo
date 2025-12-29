import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { ContentService } from "./content.service";
import { ContentController } from "./content.controller";

@Module({
  imports: [PrismaModule],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}


