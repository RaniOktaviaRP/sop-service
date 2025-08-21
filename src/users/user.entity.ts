import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Division } from 'src/divisions/division.entity';
import { SOP } from 'src/sops/sop.entity';
import { ApiProperty } from "@nestjs/swagger";
import { SOPAssignment } from 'src/sop_assignments/sop_assignment.entity';
import { UserGroup } from 'src/user_groups/user_group.entity';

export enum UserRole {
  Admin = 'Admin',
  Employee = 'Employee',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  username: string;

  @ApiProperty()
  @Column()
  password_hash: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  full_name: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: UserRole, default: UserRole.Employee })
  role: UserRole;

  @ApiProperty()
  @Column()
  division_id: number;

  @OneToMany(() => SOP, (sop) => sop.created_by_user)
  sops: SOP[];

  @ManyToOne(() => Division)
  @JoinColumn({ name: 'division_id' })
  division: Division;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => SOPAssignment, (assignment) => assignment.user)
  assignments: SOPAssignment[];

  @ManyToOne(() => UserGroup, (group) => group.users)
  @JoinColumn({ name: 'group_id' })
  group: UserGroup;

}
