import { Test, TestingModule } from '@nestjs/testing';
import { SOPVersionsService } from './sop_versions.service';

describe('SopVersionsService', () => {
  let service: SOPVersionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SOPVersionsService],
    }).compile();

    service = module.get<SOPVersionsService>(SOPVersionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
