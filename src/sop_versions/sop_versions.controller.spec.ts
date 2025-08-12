import { Test, TestingModule } from '@nestjs/testing';
import { SOPVersionsController } from './sop_versions.controller';

describe('SopVersionsController', () => {
  let controller: SOPVersionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SOPVersionsController],
    }).compile();

    controller = module.get<SOPVersionsController>(SOPVersionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
