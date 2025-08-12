import { Test, TestingModule } from '@nestjs/testing';
import { ApprovalWorkflowsService } from './approval_workflows.service';

describe('ApprovalWorkflowsService', () => {
  let service: ApprovalWorkflowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApprovalWorkflowsService],
    }).compile();

    service = module.get<ApprovalWorkflowsService>(ApprovalWorkflowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
