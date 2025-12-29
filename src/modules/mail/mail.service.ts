import { Injectable, Logger } from "@nestjs/common";
import nodemailer from "nodemailer";
import * as sgMail from "@sendgrid/mail";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendPasswordResetCode(
    email: string,
    code: string
  ): Promise<{ previewUrl?: string }> {
    // ⚠️ УВАГА: SMTP відключено для розробки
    // Для увімкнення зміни паролю налаштуйте SMTP або SendGrid
    this.logger.warn("🚫 PASSWORD RESET DISABLED - SMTP not configured");
    this.logger.warn(
      "📧 To enable password reset, configure SMTP or SendGrid in .env"
    );
    this.logger.warn(`🔑 Generated code for ${email}: ${code}`);

    // Повертаємо успіх, але не надсилаємо email
    return { previewUrl: undefined };
  }
}
