import { config } from 'dotenv';
config();

// cek apakah env terbaca
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aktif CORS
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://production-todd-clara-shoulder.trycloudflare.com',
    ],
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("SOP Management API")
    .setDescription("API untuk mengelola Standard Operating Procedure (SOP) perusahaan")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Masukkan JWT token di sini. Kamu **tidak perlu mengetik "Bearer"**, cukup token saja.',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
