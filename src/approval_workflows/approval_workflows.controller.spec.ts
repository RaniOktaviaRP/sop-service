import { Test, TestingModule } from '@nestjs/testing';
import { ApprovalWorkflowsController } from './approval_workflows.controller';

describe('ApprovalWorkflowsController', () => {
  let controller: ApprovalWorkflowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApprovalWorkflowsController],
    }).compile();

    controller = module.get<ApprovalWorkflowsController>(ApprovalWorkflowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
