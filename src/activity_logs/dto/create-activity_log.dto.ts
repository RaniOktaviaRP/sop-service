import { IsInt, IsOptional, IsString, IsEnum, IsIP } from 'class-validator';

export enum ActivityType {
  LOGIN = 'Login',
  UPLOAD = 'Upload',
  AI_QUERY = 'AI Query',
  // tambahkan sesuai kebutuhan
}

export class CreateActivityLogDto {
  @IsOptional()
  @IsInt()
  user_id?: number;

  @IsEnum(ActivityType)
  activity_type: ActivityType;

  @IsString()
  activity_description: string;

  @IsOptional()
  @IsInt()
  sop_id?: number;

  @IsOptional()
  @IsIP()
  ip_address?: string;
}
