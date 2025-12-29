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
import { ServicesService } from "./services.service";
import {
  CreateServiceCategoryDTO,
  UpdateServiceCategoryDTO,
  CreateServiceDTO,
  UpdateServiceDTO
} from "./services.dto";

// Admin routes (protected)
@Controller("services")
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // Service Categories
  @Get("categories")
  public listCategories() {
    return this.servicesService.listCategories();
  }

  @Get("categories/:id")
  public getCategoryById(@Param("id", ParseIntPipe) id: number) {
    return this.servicesService.getCategoryById(id);
  }

  @Get("categories/by-category-id/:categoryId")
  public getCategoryByCategoryId(@Param("categoryId") categoryId: string) {
    return this.servicesService.getCategoryByCategoryId(categoryId);
  }

  @Post("categories")
  public createCategory(@Body() dto: CreateServiceCategoryDTO) {
    return this.servicesService.createCategory(dto);
  }

  @Put("categories/:id")
  public updateCategory(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateServiceCategoryDTO
  ) {
    return this.servicesService.updateCategory(id, dto);
  }

  @Delete("categories/:id")
  public removeCategory(@Param("id", ParseIntPipe) id: number) {
    return this.servicesService.removeCategory(id);
  }

  // Services
  @Get()
  public listServices() {
    return this.servicesService.listServices();
  }

  @Get(":id")
  public getServiceById(@Param("id", ParseIntPipe) id: number) {
    return this.servicesService.getServiceById(id);
  }

  @Post()
  public createService(@Body() dto: CreateServiceDTO) {
    return this.servicesService.createService(dto);
  }

  @Put(":id")
  public updateService(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateServiceDTO
  ) {
    return this.servicesService.updateService(id, dto);
  }

  @Delete(":id")
  public removeService(@Param("id", ParseIntPipe) id: number) {
    return this.servicesService.removeService(id);
  }
}

// Public routes (no authentication required)
@Controller("public/services")
export class PublicServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  public getPublicServices() {
    return this.servicesService.getPublicServices();
  }
}

