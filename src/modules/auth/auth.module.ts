import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { GLOBAL_CONFIG } from "../../configs/global.config";

import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./auth.jwt.strategy";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [
    PrismaModule,
    UserModule,
    MailModule,
    JwtModule.register({
      secret: GLOBAL_CONFIG.security.jwtSecret,
      signOptions: { expiresIn: GLOBAL_CONFIG.security.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
