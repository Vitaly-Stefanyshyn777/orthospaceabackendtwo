import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("public/hero")
export class PublicHeroController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getHero() {
    try {
      const hero = await this.prisma.hero.findFirst();
      return hero;
    } catch (error) {
      console.error("Hero fetch error:", error);
      return null;
    }
  }
}
