import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateSOPAssignmentDto {
  @ApiProperty()

  @IsInt()
  sop_title: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  user_name?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  group_name?: string;
}
