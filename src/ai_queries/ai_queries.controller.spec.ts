import { Test, TestingModule } from '@nestjs/testing';
import { AiQueriesController } from './ai_queries.controller';

describe('AiQueriesController', () => {
  let controller: AiQueriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiQueriesController],
    }).compile();

    controller = module.get<AiQueriesController>(AiQueriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
