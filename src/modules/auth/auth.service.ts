import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { randomBytes } from "crypto";

import { UserService } from "../user/user.service";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";
import { AuthHelpers } from "../../shared/helpers/auth.helpers";
import { GLOBAL_CONFIG } from "../../configs/global.config";
//kdks
import { AuthResponseDTO, LoginUserDTO, RegisterUserDTO } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  public async login(loginUserDTO: LoginUserDTO): Promise<AuthResponseDTO> {
    const userData = await this.userService.findUser({
      email: loginUserDTO.email,
    });

    if (!userData) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await AuthHelpers.verify(
      loginUserDTO.password,
      userData.password
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: null,
      // role: userData.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: GLOBAL_CONFIG.security.expiresIn,
    });

    return {
      user: payload,
      accessToken: accessToken,
    };
  }
  public async register(user: RegisterUserDTO): Promise<User> {
    return this.userService.createUser(user);
  }

  public async requestPasswordReset(
    email: string
  ): Promise<{ success: boolean }> {
    const user = await this.userService.findUser({ email });
    if (!user) {
      // Avoid user enumeration
      return { success: true };
    }
    const token = randomBytes(24).toString("hex");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, token, code, expiresAt },
    });

    // Надсилаємо код на email користувача (або на адміна якщо налаштовано)
    const adminEmail = process.env.ADMIN_EMAIL || email;
    const res = await this.mailService.sendPasswordResetCode(adminEmail, code);
    return { success: true, previewUrl: res.previewUrl } as any;
  }

  public async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });
    if (!record || record.used || record.expiresAt < new Date()) {
      throw new BadRequestException("Invalid or expired token");
    }
    // Do not pre-hash here; Prisma middleware (UserListener) will hash once on update
    await this.prisma.user.update({
      where: { id: record.userId },
      data: { password: newPassword },
    });
    await this.prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    });
    return { success: true };
  }

  public async resetPasswordWithCode(
    email: string,
    code: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    const user = await this.userService.findUser({ email });
    if (!user) throw new BadRequestException("Invalid code");

    const record = await this.prisma.passwordResetToken.findFirst({
      where: { userId: user.id, used: false },
      orderBy: { createdAt: "desc" },
    });
    if (!record || record.expiresAt < new Date() || record.code !== code) {
      throw new BadRequestException("Invalid or expired code");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: newPassword },
    });
    await this.prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    });
    return { success: true };
  }
}
