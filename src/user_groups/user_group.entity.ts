import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GroupMember } from '../group_members/group_member.entity';
import { SOPAssignment } from 'src/sop_assignments/sop_assignment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';

@Entity('user_groups')
export class UserGroup {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Divisi Keuangan' })
  @Column()
  group_name: string;

  @ApiProperty({ example: 'Grup untuk divisi keuangan perusahaan' })
  @Column('text')
  description: string;

  @OneToMany(() => GroupMember, gm => gm.group)
  members: GroupMember[];

  @OneToMany(() => SOPAssignment, (assignment) => assignment.group)
  assignments: SOPAssignment[];

  @OneToMany(() => User, (user) => user.group)
  users: User[];

}
