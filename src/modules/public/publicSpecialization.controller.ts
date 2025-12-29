import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("public/specialization")
export class PublicSpecializationController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getSpecialization() {
    try {
      const specialization = await this.prisma.specialization.findFirst();
      return specialization;
    } catch (error) {
      console.error("Specialization fetch error:", error);
      return null;
    }
  }
}




