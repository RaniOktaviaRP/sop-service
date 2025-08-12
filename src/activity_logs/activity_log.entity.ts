import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { SOP } from 'src/sops/sop.entity';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: ['Login', 'Upload', 'AI Query'] })
  activity_type: string;

  @Column('text')
  activity_description: string;

  @Column({ nullable: true })
  sop_id: number;

  @ManyToOne(() => SOP, { nullable: true })
  @JoinColumn({ name: 'sop_id' })
  sop: SOP;

  @CreateDateColumn()
  timestamp: Date;

  @Column()
  ip_address: string;
}
