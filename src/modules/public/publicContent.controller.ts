import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("public/content")
export class PublicContentController {
  constructor(private prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.contentBlock.findMany({
      orderBy: { blockNumber: "asc" },
    });
  }
}


