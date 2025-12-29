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
import { AboutUsService } from "./aboutus.service";
import { CreateAboutUsDTO, UpdateAboutUsDTO } from "./aboutus.dto";
import { UploadService } from "../upload/upload.service";

@Controller("aboutus")
@UseGuards(JwtAuthGuard)
export class AboutUsController {
  constructor(
    private readonly aboutUsService: AboutUsService,
    private readonly uploadService: UploadService
  ) {}

  @Get()
  getAboutUs() {
    return this.aboutUsService.getAboutUs();
  }

  @Post()
  createAboutUs(@Body() dto: CreateAboutUsDTO) {
    return this.aboutUsService.createOrUpdateAboutUs(dto);
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
  async uploadAboutUsImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("No file uploaded");
    }

    try {
      // Завантажити в Cloudinary
      const { url, publicId } = await this.uploadService.uploadImage(
        file.buffer,
        "rekogrinik/aboutus"
      );

      // Зберегти в БД
      const result = await this.aboutUsService.createOrUpdateAboutUs({
        image: url,
      });

      return {
        ...result,
        imagePublicId: publicId,
      };
    } catch (error) {
      console.error("Upload aboutus image error:", error);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Put()
  updateAboutUs(@Body() dto: UpdateAboutUsDTO) {
    return this.aboutUsService.updateAboutUs(dto);
  }

  @Delete()
  deleteAboutUs() {
    return this.aboutUsService.deleteAboutUs();
  }
}
