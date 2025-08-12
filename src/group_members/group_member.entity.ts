import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserGroup } from '../user_groups/user_group.entity';
import { User } from 'src/users/user.entity';

@Entity('group_members')
export class GroupMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_id: number;

  @ManyToOne(() => UserGroup, group => group.members)
  @JoinColumn({ name: 'group_id' })
  group: UserGroup;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
