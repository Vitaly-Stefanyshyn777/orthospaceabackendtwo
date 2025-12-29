import { Module } from "@nestjs/common";
import { MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";

import { UserModule } from "../user/user.module";
import { PostModule } from "../post/post.module";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";
import { GLOBAL_CONFIG } from "../../configs/global.config";
import { LoggerModule } from "../logger/logger.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { LoggerMiddleware } from "../../middlewares/logger.middleware";
import { ContentModule } from "../content/content.module";
import { GalleryModule } from "../gallery/gallery.module";
import { PublicModule } from "../public/public.module";
import { UploadModule } from "../upload/upload.module";
import { HeroModule } from "../hero/hero.module";
import { ServicesModule } from "../services/services.module";
import { ContactsModule } from "../contacts/contacts.module";

@Module({
  imports: [
    LoggerModule,
    PrismaModule,
    AuthModule,
    UserModule,
    PostModule,
    ContentModule,
    GalleryModule,
    PublicModule,
    UploadModule,
    HeroModule,
    ServicesModule,
    ContactsModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => GLOBAL_CONFIG],
      envFilePath: ".env",
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
