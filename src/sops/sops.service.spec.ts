import { Test, TestingModule } from '@nestjs/testing';
import { SopsService } from './sops.service';

describe('SopsService', () => {
  let service: SopsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SopsService],
    }).compile();

    service = module.get<SopsService>(SopsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
