import { Test, TestingModule } from '@nestjs/testing';
import { AIResponseSourcesController } from './ai_response_sources.controller';

describe('AiResponseSourcesController', () => {
  let controller: AIResponseSourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AIResponseSourcesController],
    }).compile();

    controller = module.get<AIResponseSourcesController>(AIResponseSourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
