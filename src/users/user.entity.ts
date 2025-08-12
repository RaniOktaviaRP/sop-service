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

export enum UserRole {
  Admin = 'Admin',
  Employee = 'Employee',
}


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password_hash: string;

  @Column()
  email: string;

  @Column()
  full_name: string;

@Column({ type: 'enum', enum: UserRole, default: UserRole.Employee })
role: UserRole;

  @Column()
  division_id: number;

@OneToMany(() => SOP, (sop) => sop.created_by_user)
sops: SOP[];

  @ManyToOne(() => Division)
  @JoinColumn({ name: 'division_id' })
  division: Division;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
