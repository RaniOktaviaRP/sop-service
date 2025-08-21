import { IsInt } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateGroupMemberDto {
  @ApiProperty()
  @IsInt()
  group_name: string;

  @ApiProperty()
  @IsInt()
  user_name: string;
}
