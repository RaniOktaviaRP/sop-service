import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export enum UserRole {
  Admin = 'Admin',
  Employee = 'Employee',
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  password_hash: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  full_name: string;

  @ApiProperty()
  @IsEnum(UserRole)
  @IsOptional() 
  role?: UserRole;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  division_name: string; 
}
