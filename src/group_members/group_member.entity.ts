import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserGroup } from '../user_groups/user_group.entity';
import { User } from 'src/users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('group_members')
export class GroupMember {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  group_id: number;

  @ApiProperty({ type: () => UserGroup })
  @ManyToOne(() => UserGroup, group => group.members)
  @JoinColumn({ name: 'group_id' })
  group: UserGroup;

  @ApiProperty()
  @Column()
  user_id: number;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
