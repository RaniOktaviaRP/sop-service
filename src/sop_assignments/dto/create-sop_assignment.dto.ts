import { IsInt, IsOptional } from 'class-validator';

export class CreateSOPAssignmentDto {
  @IsInt()
  sop_id: number;

  @IsOptional()
  @IsInt()
  user_id?: number;

  @IsOptional()
  @IsInt()
  group_id?: number;
}
