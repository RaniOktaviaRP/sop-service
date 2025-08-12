import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIQuery } from './ai_query.entity';
import { CreateAIQueryDto } from './dto/create-ai_query.dto';

@Injectable()
export class AIQueriesService {
  constructor(
    @InjectRepository(AIQuery)
    private aiQueryRepository: Repository<AIQuery>,
  ) {}

  async create(queryDto: CreateAIQueryDto): Promise<AIQuery> {
    const newQuery = this.aiQueryRepository.create(queryDto);
    return await this.aiQueryRepository.save(newQuery);
  }

  async findAll(): Promise<AIQuery[]> {
    return this.aiQueryRepository.find({ relations: ['user', 'sources'] });
  }

  async findByUserId(userId: number): Promise<AIQuery[]> {
    return this.aiQueryRepository.find({
      where: { user_id: userId },
      relations: ['sources'],
    });
  }

  async addFeedback(queryId: number, feedback: string): Promise<AIQuery> {
    const query = await this.aiQueryRepository.findOneBy({ id: queryId });
    if (!query) throw new Error('Query tidak ditemukan');
    query.feedback = feedback;
    return await this.aiQueryRepository.save(query);
  }
}
