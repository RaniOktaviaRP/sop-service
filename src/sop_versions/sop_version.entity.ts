import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { SOP } from '../sops/sop.entity';
import { User } from 'src/users/user.entity';

@Entity('sop_versions')
export class SOPVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sop_id: number;

  @ManyToOne(() => SOP, sop => sop.versions)
  @JoinColumn({ name: 'sop_id' })
  sop: SOP;

  @Column()
  version_number: string;

  @Column('text')
  file_path: string;

  @Column({ type: 'enum', enum: ['PDF', 'DOCX'] })
  file_type: string;

  @Column('text')
  text_content: string;

  @Column('text')
  changelog: string;

  @Column({ nullable: true })
  uploaded_by_user_id?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by_user_id' })
  uploaded_by: User;

  @Column({ nullable: true })
  approved_by_user_id?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by_user_id' })
  approved_by: User;

  @CreateDateColumn()
  uploaded_at: Date;

  @Column({ nullable: true })
  approved_at: Date;
}
