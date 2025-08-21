import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { SOP } from 'src/sops/sop.entity';

@Entity('sop_files')
export class SOPFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file_name: string;

  @Column({ nullable: true })
  file_type: string;

  @Column({ type: 'bigint', nullable: true })
  file_size: number;

  @Column({ type: 'bytea', nullable: true }) 
  data: Buffer;

  @Column({ nullable: true })
  file_path?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'uploaded_by_user_id' })
  uploaded_by_user?: User;

  @ManyToOne(() => SOP, (sop) => sop.files, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sop_id' })
  sop?: SOP;

  @CreateDateColumn()
  uploaded_at: Date;
}
