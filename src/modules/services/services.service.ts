import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ServiceCategory, Service } from "@prisma/client";
import {
  CreateServiceCategoryDTO,
  UpdateServiceCategoryDTO,
  CreateServiceDTO,
  UpdateServiceDTO
} from "./services.dto";

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  // Service Categories CRUD
  public async listCategories(): Promise<ServiceCategory[]> {
    return this.prisma.serviceCategory.findMany({
      include: {
        services: {
          where: { isActive: true },
          orderBy: { order: "asc" }
        }
      },
      orderBy: { order: "asc" },
    });
  }

  public async getCategoryById(id: number): Promise<ServiceCategory> {
    const category = await this.prisma.serviceCategory.findUnique({
      where: { id },
      include: {
        services: {
          where: { isActive: true },
          orderBy: { order: "asc" }
        }
      }
    });
    if (!category) throw new NotFoundException("Service category not found");
    return category;
  }

  public async getCategoryByCategoryId(categoryId: string): Promise<ServiceCategory> {
    const category = await this.prisma.serviceCategory.findUnique({
      where: { categoryId },
      include: {
        services: {
          where: { isActive: true },
          orderBy: { order: "asc" }
        }
      }
    });
    if (!category) throw new NotFoundException("Service category not found");
    return category;
  }

  public async createCategory(dto: CreateServiceCategoryDTO): Promise<ServiceCategory> {
    return this.prisma.serviceCategory.create({
      data: dto,
      include: {
        services: {
          where: { isActive: true },
          orderBy: { order: "asc" }
        }
      }
    });
  }

  public async updateCategory(
    id: number,
    dto: UpdateServiceCategoryDTO
  ): Promise<ServiceCategory> {
    await this.getCategoryById(id);
    return this.prisma.serviceCategory.update({
      where: { id },
      data: dto,
      include: {
        services: {
          where: { isActive: true },
          orderBy: { order: "asc" }
        }
      }
    });
  }

  public async removeCategory(id: number): Promise<void> {
    await this.getCategoryById(id);
    await this.prisma.serviceCategory.delete({ where: { id } });
  }

  // Services CRUD
  public async listServices(): Promise<Service[]> {
    return this.prisma.service.findMany({
      include: { category: true },
      where: { isActive: true },
      orderBy: [
        { category: { order: "asc" } },
        { order: "asc" }
      ],
    });
  }

  public async getServiceById(id: number): Promise<Service> {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: { category: true }
    });
    if (!service) throw new NotFoundException("Service not found");
    return service;
  }

  public async createService(dto: CreateServiceDTO): Promise<Service> {
    // Verify category exists
    await this.getCategoryById(dto.categoryId);

    return this.prisma.service.create({
      data: dto,
      include: { category: true }
    });
  }

  public async updateService(
    id: number,
    dto: UpdateServiceDTO
  ): Promise<Service> {
    await this.getServiceById(id);

    // Verify category exists if categoryId is being updated
    if (dto.categoryId) {
      await this.getCategoryById(dto.categoryId);
    }

    return this.prisma.service.update({
      where: { id },
      data: dto,
      include: { category: true }
    });
  }

  public async removeService(id: number): Promise<void> {
    await this.getServiceById(id);
    await this.prisma.service.delete({ where: { id } });
  }

  // Public API methods (without authentication)
  public async getPublicServices(): Promise<ServiceCategory[]> {
    return this.prisma.serviceCategory.findMany({
      include: {
        services: {
          where: { isActive: true },
          orderBy: { order: "asc" }
        }
      },
      orderBy: { order: "asc" },
    });
  }
}

