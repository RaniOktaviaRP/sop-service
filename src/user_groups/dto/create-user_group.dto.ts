import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserGroupDto {
  @ApiProperty()
  @IsString()
  group_name: string;

  @ApiProperty()
  @IsString()
  description: string;
}

