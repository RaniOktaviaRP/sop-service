import { IsString, IsInt, IsOptional, IsEnum, IsArray } from 'class-validator';

export enum SOPStatus {
  Draft = 'Draft',
  PendingReview = 'Pending Review',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Revisi = 'Revisi',
}

export class CreateSOPDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  category_id: number;

  @IsInt()
  division_id: number;

  @IsOptional()
  @IsEnum(SOPStatus)
  status: SOPStatus = SOPStatus.PendingReview;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) 
  tags?: string[];

  @IsOptional()
  @IsString()
  status_reason?: string; 
}
