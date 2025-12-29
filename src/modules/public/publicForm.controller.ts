import {
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../prisma/prisma.service";
import { PublicFormDTO } from "./publicForm.dto";
import { TelegramService } from "../telegram/telegram.service";

@ApiTags("public/form")
@Controller("public/form")
export class PublicFormController {
  constructor(
    private prisma: PrismaService,
    private telegramService: TelegramService
  ) {}

  @Post()
  @ApiCreatedResponse({ description: "Form submission stored" })
  async submit(
    @Body() dto: PublicFormDTO,
    @Headers("user-agent") userAgent?: string,
    @Ip() ip?: string
  ) {
    const created = await this.prisma.formSubmission.create({
      data: {
        name: dto.name || dto.email || "Користувач",
        phone: dto.phone,
        email: dto.email,
        workType: dto.workType,
        message: dto.message,
        consent: dto.consent,
        address: dto.address,
        contactTime: dto.contactTime,
        source: dto.source ? (dto.source as any) : undefined,
        files: dto.files ? (dto.files as any) : undefined,
        locale: dto.locale ?? "uk",
        userAgent,
        ip,
      },
    });

    void this.telegramService.notifyNewFormSubmission(created, {
      ip,
      userAgent,
    });

    return { id: created.id, createdAt: created.createdAt };
  }

  @Get()
  @ApiOkResponse({ description: "List form submissions" })
  async list(@Query("limit") limit = 20) {
    const take = Math.min(Number(limit) || 20, 100);
    const rows = await this.prisma.formSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        workType: true,
        message: true,
        consent: true,
        address: true,
        contactTime: true,
        source: true,
        files: true,
        locale: true,
        createdAt: true,
      },
    });
    return rows;
  }

  @Get(":id")
  @ApiOkResponse({ description: "Get form submission by id" })
  async getById(@Param("id", ParseIntPipe) id: number) {
    const row = await this.prisma.formSubmission.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        workType: true,
        message: true,
        consent: true,
        address: true,
        contactTime: true,
        source: true,
        files: true,
        locale: true,
        createdAt: true,
      },
    });
    return row ?? null;
  }
}
