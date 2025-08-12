import { Test, TestingModule } from '@nestjs/testing';
import { SOPAssignmentsService } from './sop_assignments.service';

describe('SopAssignmentsService', () => {
  let service: SOPAssignmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SOPAssignmentsService],
    }).compile();

    service = module.get<SOPAssignmentsService>(SOPAssignmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
