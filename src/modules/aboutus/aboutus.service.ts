import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAboutUsDTO, UpdateAboutUsDTO } from "./aboutus.dto";

@Injectable()
export class AboutUsService {
  constructor(private prisma: PrismaService) {}

  // Отримати AboutUs (завжди тільки один)
  async getAboutUs() {
    return this.prisma.aboutUs.findFirst();
  }

  // Створити або оновити AboutUs
  async createOrUpdateAboutUs(dto: CreateAboutUsDTO) {
    // Видалити існуючий AboutUs (тільки один може бути)
    await this.prisma.aboutUs.deleteMany();

    // Створити новий
    return this.prisma.aboutUs.create({
      data: dto,
    });
  }

  // Оновити AboutUs
  async updateAboutUs(dto: UpdateAboutUsDTO) {
    const aboutUs = await this.prisma.aboutUs.findFirst();
    if (!aboutUs) {
      throw new NotFoundException("AboutUs not found");
    }

    return this.prisma.aboutUs.update({
      where: { id: aboutUs.id },
      data: dto,
    });
  }

  // Видалити AboutUs
  async deleteAboutUs() {
    await this.prisma.aboutUs.deleteMany();
    return { message: "AboutUs deleted successfully" };
  }
}




