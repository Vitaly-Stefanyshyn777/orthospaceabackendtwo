import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSpecializationDTO, UpdateSpecializationDTO } from "./specialization.dto";

@Injectable()
export class SpecializationService {
  constructor(private prisma: PrismaService) {}

  // Отримати Specialization (завжди тільки один)
  async getSpecialization() {
    return this.prisma.specialization.findFirst();
  }

  // Створити або оновити Specialization
  async createOrUpdateSpecialization(dto: CreateSpecializationDTO) {
    // Видалити існуючий Specialization (тільки один може бути)
    await this.prisma.specialization.deleteMany();

    // Створити новий
    return this.prisma.specialization.create({
      data: dto,
    });
  }

  // Оновити Specialization
  async updateSpecialization(dto: UpdateSpecializationDTO) {
    const specialization = await this.prisma.specialization.findFirst();
    if (!specialization) {
      throw new NotFoundException("Specialization not found");
    }

    return this.prisma.specialization.update({
      where: { id: specialization.id },
      data: dto,
    });
  }

  // Видалити Specialization
  async deleteSpecialization() {
    await this.prisma.specialization.deleteMany();
    return { message: "Specialization deleted successfully" };
  }
}




