import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("public/aboutus")
export class PublicAboutUsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAboutUs() {
    try {
      const aboutUs = await this.prisma.aboutUs.findFirst();
      return aboutUs;
    } catch (error) {
      console.error("AboutUs fetch error:", error);
      return null;
    }
  }
}




