import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aktifkan CORS agar bisa fetch dari Next.js (via Cloudflare)
  app.enableCors({
  origin: [
    'http://localhost:3000', // ✅ saat kamu akses dari frontend lokal
    'https://join-dot-constitutional-ar.trycloudflare.com/', // ✅ saat kamu akses dari URL tunnel
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
});

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
