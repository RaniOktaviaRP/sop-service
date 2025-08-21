import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SOP } from 'src/sops/sop.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  category_name: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @OneToMany(() => SOP, sop => sop.category)
  sops: SOP[];
}
