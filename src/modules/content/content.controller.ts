import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/auth.jwt.guard";
import { ContentService } from "./content.service";
import { CreateContentBlockDTO, UpdateContentBlockDTO } from "./content.dto";

@Controller("content")
@UseGuards(JwtAuthGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  public list() {
    return this.contentService.list();
  }

  @Get(":id")
  public getById(@Param("id", ParseIntPipe) id: number) {
    return this.contentService.getById(id);
  }

  @Post()
  public create(@Body() dto: CreateContentBlockDTO) {
    return this.contentService.create(dto);
  }

  @Put(":id")
  public update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateContentBlockDTO
  ) {
    return this.contentService.update(id, dto);
  }

  @Delete(":id")
  public remove(@Param("id", ParseIntPipe) id: number) {
    return this.contentService.remove(id);
  }
}


