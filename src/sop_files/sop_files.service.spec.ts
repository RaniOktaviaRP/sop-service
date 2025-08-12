import { Test, TestingModule } from '@nestjs/testing';
import { SopFilesService } from './sop_files.service';

describe('SopFilesService', () => {
  let service: SopFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SopFilesService],
    }).compile();

    service = module.get<SopFilesService>(SopFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
