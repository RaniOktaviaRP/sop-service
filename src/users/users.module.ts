// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // ✅ ini wajib
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // jika dibutuhkan di module lain
})
export class UsersModule {}
