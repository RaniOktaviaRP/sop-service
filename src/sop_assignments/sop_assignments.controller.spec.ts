import { Test, TestingModule } from '@nestjs/testing';
import { SOPAssignmentsController } from './sop_assignments.controller';

describe('SopAssignmentsController', () => {
  let controller: SOPAssignmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SOPAssignmentsController],
    }).compile();

    controller = module.get<SOPAssignmentsController>(SOPAssignmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
