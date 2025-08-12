import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIResponseSource } from './ai_response_source.entity';
import { CreateAIResponseSourceDto } from './dto/create-ai_response_source.dto';

@Injectable()
export class AIResponseSourcesService {
  constructor(
    @InjectRepository(AIResponseSource)
    private responseSourceRepo: Repository<AIResponseSource>,
  ) {}

  async create(dto: CreateAIResponseSourceDto): Promise<AIResponseSource> {
    const source = this.responseSourceRepo.create(dto);
    return await this.responseSourceRepo.save(source);
  }

  async findByQueryId(queryId: number): Promise<AIResponseSource[]> {
    return this.responseSourceRepo.find({
      where: { query_id: queryId },
      relations: ['sop', 'version'],
    });
  }
}
