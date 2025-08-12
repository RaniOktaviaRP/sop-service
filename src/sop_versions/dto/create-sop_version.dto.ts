import { IsInt, IsString, IsEnum } from 'class-validator';

export class CreateSOPVersionDto {
  @IsInt()
  sop_id: number;

  @IsString()
  version_number: string;

  @IsString()
  file_path: string;

  @IsEnum(['PDF', 'DOCX'])
  file_type: 'PDF' | 'DOCX';

  @IsString()
  text_content: string;

  @IsString()
  changelog: string;

  @IsInt()
  uploaded_by_user_id: number;
}
