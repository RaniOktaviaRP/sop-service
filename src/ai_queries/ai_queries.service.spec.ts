import { Test, TestingModule } from '@nestjs/testing';
import { AIQueriesService } from './ai_queries.service';

describe('AiQueriesService', () => {
  let service: AIQueriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AIQueriesService],
    }).compile();

    service = module.get<AIQueriesService>(AIQueriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
