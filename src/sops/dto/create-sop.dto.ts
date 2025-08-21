import { IsString, IsInt, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export enum SOPStatus {
  Draft = 'Draft',
  PendingReview = 'Pending Review',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Revisi = 'Revisi',
}

export class CreateSOPDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsInt()
  category_id: number;

  @ApiProperty()
  @IsInt()
  division_id: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(SOPStatus)
  status: SOPStatus = SOPStatus.PendingReview;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  status_reason?: string;
}
