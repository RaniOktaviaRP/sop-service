import { IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateDivisionDto {
  @ApiProperty()
  @IsString()
  division_name: string;

  @ApiProperty()
  @IsString()
  description: string;
}
