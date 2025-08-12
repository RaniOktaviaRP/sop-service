import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIQueriesService } from './ai_queries.service';
import { AIQueriesController } from './ai_queries.controller';
import { AIQuery } from './ai_query.entity'; // pastikan path-nya sesuai

@Module({
  imports: [TypeOrmModule.forFeature([AIQuery])], // ✅ Tambahkan ini
  providers: [AIQueriesService],
  controllers: [AIQueriesController],
  exports: [AIQueriesService], // (opsional) jika servicenya dipakai di module lain
})
export class AIQueriesModule {}
