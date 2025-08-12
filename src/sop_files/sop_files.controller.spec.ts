import { Test, TestingModule } from '@nestjs/testing';
import { SopFilesController } from './sop_files.controller';

describe('SopFilesController', () => {
  let controller: SopFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SopFilesController],
    }).compile();

    controller = module.get<SopFilesController>(SopFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
