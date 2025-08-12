import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMembersService } from './group_members.service';
import { GroupMembersController } from './group_members.controller';
import { GroupMember } from './group_member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMember])], // ✅ tambahkan ini
  providers: [GroupMembersService],
  controllers: [GroupMembersController],
})
export class GroupMembersModule {}
