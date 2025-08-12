import { PartialType } from '@nestjs/mapped-types';
import { CreateSOPDto } from './create-sop.dto';

export class UpdateSOPDto extends PartialType(CreateSOPDto) {}
