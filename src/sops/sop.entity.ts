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
import { Category } from 'src/categories/category.entity';
import { Division } from 'src/divisions/division.entity';
import { User } from 'src/users/user.entity';
import { SOPVersion } from '../sop_versions/sop_version.entity';
import { SOPFile } from 'src/sop_files/sop_file.entity';

@Entity('sops')
export class SOP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  current_version_id?: number;

  @Column()
  category_id: number;

  @Column({ nullable: true })
  division_id: number;

  @ManyToOne(() => User, (user) => user.sops, { eager: false, nullable: true })
  @JoinColumn({ name: 'created_by_user_id' })
  created_by_user: User;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Division)
  @JoinColumn({ name: 'division_id' })
  division: Division;

  @Column({ default: 'Pending Review' })
  status: string;

  @Column({ type: 'text', nullable: true }) // ✅ Tambahan alasan jika status Revisi/Rejected
  status_reason?: string;

  @OneToMany(() => SOPVersion, version => version.sop)
  versions: SOPVersion[];

  @Column("text", { array: true, nullable: true })
  tags?: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => SOPFile, (file) => file.sop)
  files: SOPFile[];
}
