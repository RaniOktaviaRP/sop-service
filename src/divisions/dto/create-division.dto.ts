import { IsString } from 'class-validator';

export class CreateDivisionDto {
  @IsString()
  division_name: string;

  @IsString()
  description: string;
}
