import { IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  category_name: string;

  @ApiProperty()
  @IsString()
  description: string;
}
