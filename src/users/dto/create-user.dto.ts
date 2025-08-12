import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum UserRole {
  Admin = 'Admin',
  Employee = 'Employee',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  password_hash: string;

  @IsEmail()
  email: string;

  @IsString()
  full_name: string;

@IsEnum(UserRole)
role: UserRole;

  @IsNotEmpty()
  division_id: number;
}
