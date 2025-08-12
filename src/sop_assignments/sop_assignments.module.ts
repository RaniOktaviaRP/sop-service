// sop-assignments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SOPAssignmentsService } from './sop_assignments.service';
import { SOPAssignment } from './sop_assignment.entity';
import { SOPAssignmentsController } from './sop_assignments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SOPAssignment])],
  providers: [SOPAssignmentsService],
  controllers: [SOPAssignmentsController],
  exports: [SOPAssignmentsService],
})
export class SOPAssignmentsModule {}
