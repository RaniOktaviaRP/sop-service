import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMembersService } from './group_members.service';
import { GroupMembersController } from './group_members.controller';
import { GroupMember } from './group_member.entity';
import { UsersModule } from 'src/users/users.module';
import { UserGroupsModule } from 'src/user_groups/user_groups.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupMember]),
    UsersModule,
    UserGroupsModule, 
  ],
  controllers: [GroupMembersController],
  providers: [GroupMembersService],
})
export class GroupMembersModule {}
