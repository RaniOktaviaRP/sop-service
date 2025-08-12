import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GroupMember } from '../group_members/group_member.entity';
import { SOPAssignment } from 'src/sop_assignments/sop_assignment.entity';

@Entity('user_groups')
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_name: string;

  @Column('text')
  description: string;

  @OneToMany(() => GroupMember, gm => gm.group)
  members: GroupMember[];

  @OneToMany(() => SOPAssignment, a => a.group)
  assignments: SOPAssignment[];
}
