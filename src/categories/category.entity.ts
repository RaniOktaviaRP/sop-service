import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SOP } from 'src/sops/sop.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category_name: string;

  @Column('text')
  description: string;

  @OneToMany(() => SOP, sop => sop.category)
  sops: SOP[];
}
