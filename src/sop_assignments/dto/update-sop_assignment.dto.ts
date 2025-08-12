import { PartialType } from '@nestjs/mapped-types';
import { CreateSOPAssignmentDto } from './create-sop_assignment.dto';

export class UpdateSOPAssignmentDto extends PartialType(CreateSOPAssignmentDto) {}
