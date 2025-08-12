import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalWorkflowsService } from './approval_workflows.service';
import { ApprovalWorkflowsController } from './approval_workflows.controller';
import { ApprovalWorkflow } from './approval_workflow.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([ApprovalWorkflow])],
  providers: [ApprovalWorkflowsService],
  controllers: [ApprovalWorkflowsController],
  exports: [ApprovalWorkflowsService], 
})
export class ApprovalWorkflowsModule {}
