import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateHeroDTO, UpdateHeroDTO } from "./hero.dto";

@Injectable()
export class HeroService {
  constructor(private prisma: PrismaService) {}

  // Отримати Hero (завжди тільки один)
  async getHero() {
    return this.prisma.hero.findFirst();
  }

  // Створити або оновити Hero
  async createOrUpdateHero(dto: CreateHeroDTO) {
    // Видалити існуючий Hero (тільки один може бути)
    await this.prisma.hero.deleteMany();

    // Створити новий
    return this.prisma.hero.create({
      data: dto,
    });
  }

  // Оновити Hero
  async updateHero(dto: UpdateHeroDTO) {
    const hero = await this.prisma.hero.findFirst();
    if (!hero) {
      throw new NotFoundException("Hero not found");
    }

    return this.prisma.hero.update({
      where: { id: hero.id },
      data: dto,
    });
  }

  // Видалити Hero
  async deleteHero() {
    await this.prisma.hero.deleteMany();
    return { message: "Hero deleted successfully" };
  }
}


