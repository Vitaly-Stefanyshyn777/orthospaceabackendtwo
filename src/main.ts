import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import cors from "cors";
import cookieParser from "cookie-parser";

import { AppModule } from "./modules/app/app.module";
import { API_PREFIX } from "./shared/constants/global.constants";
import { SwaggerConfig } from "./configs/config.interface";
import { GLOBAL_CONFIG } from "./configs/global.config";
import { MyLogger } from "./modules/logger/logger.service";
import { InvalidFormExceptionFilter } from "./filters/invalid.form.exception.filter";
import { AllExceptionsFilter } from "./filters/all.exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "error", "warn"],
  });

  app.setGlobalPrefix(API_PREFIX);

  app.useGlobalFilters(
    new AllExceptionsFilter(app.get(HttpAdapterHost)),
    new InvalidFormExceptionFilter()
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        // Логування для діагностики (тільки в development)
        if (process.env.NODE_ENV !== "production") {
          console.log("CORS request from origin:", origin);
        }

        // Дозволяємо всі localhost порти та Railway домени
        const allowedOrigins = [
          !origin, // Дозволяємо запити без origin (наприклад, Postman)
          origin?.startsWith("http://localhost:"),
          origin?.startsWith("http://127.0.0.1:"),
          origin === process.env.FRONTEND_URL,
          origin === "https://rekogrinik.cz",
          origin?.startsWith("https://rekogrinik.cz"),
          origin === "https://www.rekogrinik.cz",
          origin?.startsWith("https://www.rekogrinik.cz"),
          origin === "https://rekogrinikadmin-production.up.railway.app",
          origin?.startsWith("https://rekogrinikadmin-production.up.railway.app"),
          origin === "https://rekogrinikfront-production.up.railway.app",
          origin?.startsWith("https://rekogrinikfront-production.up.railway.app"),
          origin === "https://rekogrinikfront-production-7069.up.railway.app",
          origin?.startsWith("https://rekogrinikfront-production-7069.up.railway.app"),
          origin === "https://rekogrinikadmin-production-cf18.up.railway.app",
          origin?.startsWith("https://rekogrinikadmin-production-cf18.up.railway.app"),
          origin === "https://orthospaceadmintwo-4f1f.vercel.app",
          origin?.startsWith("https://orthospaceadmintwo-4f1f.vercel.app"),
        ];

        if (allowedOrigins.some((condition) => condition === true)) {
          callback(null, true);
        } else {
          if (process.env.NODE_ENV !== "production") {
            console.log("CORS blocked origin:", origin);
          }
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      exposedHeaders: ["Content-Length", "Content-Type"],
    })
  );

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get<ConfigService>(ConfigService);
  const swaggerConfig = configService.get<SwaggerConfig>("swagger");

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || "Nestjs")
      .setDescription(swaggerConfig.description || "The nestjs API description")
      .setVersion(swaggerConfig.version || "1.0")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path || "api", app, document);
  }

  const PORT = process.env.PORT || GLOBAL_CONFIG.nest.port;
  await app.listen(PORT, async () => {
    const myLogger = await app.resolve(MyLogger);
    myLogger.log(`Server started listening: ${PORT}`);
  });
}
bootstrap();
