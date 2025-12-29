import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/auth.jwt.guard";
import { HeroService } from "./hero.service";
import { CreateHeroDTO, UpdateHeroDTO } from "./hero.dto";
import { UploadService } from "../upload/upload.service";

@Controller("hero")
@UseGuards(JwtAuthGuard)
export class HeroController {
  constructor(
    private readonly heroService: HeroService,
    private readonly uploadService: UploadService
  ) {}

  @Get()
  getHero() {
    return this.heroService.getHero();
  }

  @Post()
  createHero(@Body() dto: CreateHeroDTO) {
    return this.heroService.createOrUpdateHero(dto);
  }

  @Post("upload-background")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        // Дозволені MIME типи зображень
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          'image/bmp',
          'image/tiff'
        ];

        // Перевірка MIME типу
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          // Також перевіряємо розширення файлу як fallback
          const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i;
          if (allowedExtensions.test(file.originalname)) {
            cb(null, true);
          } else {
            cb(new BadRequestException("Only image files allowed (jpg, jpeg, png, gif, webp, svg, bmp, tiff)"), false);
          }
        }
      },
    })
  )
  async uploadHeroBackground(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    try {
      // Завантажити в Cloudinary
      const { url, publicId } = await this.uploadService.uploadImage(
        file.buffer,
        "rekogrinik/hero"
      );

      // Оновити Hero з новим фоновим зображенням
      const existingHero = await this.heroService.getHero();

      let result;
      if (existingHero) {
        // Оновити існуючий
        result = await this.heroService.updateHero({
          backgroundImage: url,
        });
      } else {
        // Створити новий з дефолтними значеннями
        result = await this.heroService.createOrUpdateHero({
          title: "Welcome to RekoGrinik",
          subtitle: "Professional renovation services",
          backgroundImage: url,
        });
      }

      return {
        ...result,
        backgroundImagePublicId: publicId,
      };
    } catch (error) {
      console.error("Upload hero background error:", error);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Put()
  updateHero(@Body() dto: UpdateHeroDTO) {
    return this.heroService.updateHero(dto);
  }

  @Delete()
  deleteHero() {
    return this.heroService.deleteHero();
  }
}


