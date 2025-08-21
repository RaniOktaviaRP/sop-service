import { IsInt, IsOptional, IsString, IsEnum, IsIP } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export enum ActivityType {
  LOGIN = 'Login',
  UPLOAD = 'Upload',
  AI_QUERY = 'AI Query',
}

export class CreateActivityLogDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  user_id?: number;

  @ApiProperty()
  @IsEnum(ActivityType)
  activity_type: ActivityType;

  @ApiProperty()
  @IsString()
  activity_description: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  sop_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsIP()
  ip_address?: string;
}
