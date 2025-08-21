import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { Division } from '../divisions/division.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([User, Division])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], 
})
export class UsersModule {}
