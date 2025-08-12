import { Test, TestingModule } from '@nestjs/testing';
import { SopsController } from './sops.controller';

describe('SopsController', () => {
  let controller: SopsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SopsController],
    }).compile();

    controller = module.get<SopsController>(SopsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
