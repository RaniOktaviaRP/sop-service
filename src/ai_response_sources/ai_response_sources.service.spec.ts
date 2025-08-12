import { Test, TestingModule } from '@nestjs/testing';
import { AIResponseSourcesService } from './ai_response_sources.service';

describe('AiResponseSourcesService', () => {
  let service: AIResponseSourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AIResponseSourcesService],
    }).compile();

    service = module.get<AIResponseSourcesService>(AIResponseSourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
