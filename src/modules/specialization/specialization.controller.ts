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
import { SpecializationService } from "./specialization.service";
import { CreateSpecializationDTO, UpdateSpecializationDTO } from "./specialization.dto";
import { UploadService } from "../upload/upload.service";

@Controller("specialization")
@UseGuards(JwtAuthGuard)
export class SpecializationController {
  constructor(
    private readonly specializationService: SpecializationService,
    private readonly uploadService: UploadService
  ) {}

  @Get()
  getSpecialization() {
    return this.specializationService.getSpecialization();
  }

  @Post()
  createSpecialization(@Body() dto: CreateSpecializationDTO) {
    return this.specializationService.createOrUpdateSpecialization(dto);
  }

  @Post("upload")
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
  async uploadSpecializationImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    try {
      // Завантажити в Cloudinary
      const { url, publicId } = await this.uploadService.uploadImage(
        file.buffer,
        "rekogrinik/specialization"
      );

      // Зберегти в БД
      const result = await this.specializationService.createOrUpdateSpecialization({
        image: url,
      });

      return {
        ...result,
        imagePublicId: publicId,
      };
    } catch (error) {
      console.error("Upload specialization image error:", error);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Put()
  updateSpecialization(@Body() dto: UpdateSpecializationDTO) {
    return this.specializationService.updateSpecialization(dto);
  }

  @Delete()
  deleteSpecialization() {
    return this.specializationService.deleteSpecialization();
  }
}
