import { IsInt } from 'class-validator';

export class CreateGroupMemberDto {
  @IsInt()
  group_id: number;

  @IsInt()
  user_id: number;
}
