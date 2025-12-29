import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { PublicContentController } from "./publicContent.controller";
import { PublicGalleryController } from "./publicGallery.controller";
import { PublicHeroController } from "./publicHero.controller";
import { GalleryPairsService } from "../gallery/gallery-pairs.service";
import { PublicFormController } from "./publicForm.controller";
import { TelegramModule } from "../telegram/telegram.module";
import { PublicContactsController } from "../contacts/contacts.controller";
import { ServicesModule } from "../services/services.module";
import { ContactsModule } from "../contacts/contacts.module";
import { PublicAboutUsController } from "./publicAboutUs.controller";
import { PublicSpecializationController } from "./publicSpecialization.controller";
import { AboutUsModule } from "../aboutus/aboutus.module";
import { SpecializationModule } from "../specialization/specialization.module";

@Module({
  imports: [PrismaModule, TelegramModule, ServicesModule, ContactsModule, AboutUsModule, SpecializationModule],
  controllers: [
    PublicContentController,
    PublicGalleryController,
    PublicHeroController,
    PublicFormController,
    PublicContactsController,
    PublicAboutUsController,
    PublicSpecializationController,
  ],
  providers: [GalleryPairsService],
})
export class PublicModule {}
