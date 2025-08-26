import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GroupMember } from '../group_members/group_member.entity';
import { SOPAssignment } from 'src/sop_assignments/sop_assignment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';

@Entity('user_groups')
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: true })
  group_name: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @OneToMany(() => GroupMember, (member) => member.group)
  members: GroupMember[];

  @OneToMany(() => SOPAssignment, (assignment) => assignment.group)
  assignments: SOPAssignment[];

  @OneToMany(() => User, (user) => user.group)
  users: User[];

}
