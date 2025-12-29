import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ContentBlock } from "@prisma/client";
import { CreateContentBlockDTO, UpdateContentBlockDTO } from "./content.dto";

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  public async list(): Promise<ContentBlock[]> {
    return this.prisma.contentBlock.findMany({
      orderBy: { blockNumber: "asc" },
    });
  }

  public async getById(id: number): Promise<ContentBlock> {
    const block = await this.prisma.contentBlock.findUnique({ where: { id } });
    if (!block) throw new NotFoundException("Content block not found");
    return block;
  }

  public async create(dto: CreateContentBlockDTO): Promise<ContentBlock> {
    return this.prisma.contentBlock.create({ data: dto });
  }

  public async update(
    id: number,
    dto: UpdateContentBlockDTO
  ): Promise<ContentBlock> {
    await this.getById(id);
    return this.prisma.contentBlock.update({ where: { id }, data: dto });
  }

  public async remove(id: number): Promise<void> {
    await this.getById(id);
    await this.prisma.contentBlock.delete({ where: { id } });
  }
}


