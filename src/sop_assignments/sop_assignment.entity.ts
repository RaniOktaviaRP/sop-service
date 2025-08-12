import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SOP } from 'src/sops/sop.entity';
import { User } from 'src/users/user.entity';
import { UserGroup } from 'src/user_groups/user_group.entity';

@Entity('sop_assignments')
export class SOPAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sop_id: number;

  @Column({ nullable: true }) // ✅ Tambahkan ini
  email?: string;

  @ManyToOne(() => SOP)
  @JoinColumn({ name: 'sop_id' })
  sop: SOP;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  group_id: number;

  @ManyToOne(() => UserGroup, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group: UserGroup;

  @CreateDateColumn()
  assigned_at: Date;
}
