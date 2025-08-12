import { IsString } from 'class-validator';

export class CreateUserGroupDto {
  @IsString()
  group_name: string;

  @IsString()
  description: string;
}
