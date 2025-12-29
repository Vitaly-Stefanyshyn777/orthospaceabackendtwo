import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Force HTTPS
});

@Injectable()
export class UploadService {
  constructor() {
    // Перевіряємо налаштування Cloudinary
    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? "***" : "MISSING",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "***" : "MISSING",
    });
  }

  async uploadImage(
    buffer: Buffer,
    folder: string
  ): Promise<{ url: string; publicId: string }> {
    console.log("Starting Cloudinary upload:", {
      bufferSize: buffer.length,
      folder,
    });

    const res = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          quality: "auto",
          fetch_format: "auto",
        },
        (err, result) => {
          if (err) {
            console.error("Cloudinary upload error:", err);
            return reject(err);
          }
          console.log("Cloudinary upload success:", {
            public_id: result.public_id,
            secure_url: result.secure_url,
          });
          resolve(result);
        }
      );
      stream.end(buffer);
    });
    return { url: res.secure_url, publicId: res.public_id };
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
