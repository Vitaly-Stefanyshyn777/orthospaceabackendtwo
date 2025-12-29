import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ServicesController, PublicServicesController } from "./services.controller";
import { ServicesService } from "./services.service";

@Module({
  imports: [PrismaModule],
  controllers: [ServicesController, PublicServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
