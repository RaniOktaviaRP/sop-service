import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIResponseSourcesService } from './ai_response_sources.service';
import { AIResponseSourcesController } from './ai_response_sources.controller';
import { AIResponseSource } from './ai_response_source.entity'; // pastikan path-nya benar

@Module({
  imports: [TypeOrmModule.forFeature([AIResponseSource])], // ✅ Tambahkan ini
  providers: [AIResponseSourcesService],
  controllers: [AIResponseSourcesController],
  exports: [AIResponseSourcesService], // (opsional) jika ingin dipakai di module lain
})
export class AIResponseSourcesModule {}
