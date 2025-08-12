import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from 'src/users/user.entity';
import { SOP } from 'src/sops/sop.entity';

@Entity('divisions')
export class Division {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  division_name: string;

  @Column('text')
  description: string;

  @OneToMany(() => User, user => user.division)
  users: User[];

  @OneToMany(() => SOP, sop => sop.division)
  sops: SOP[];
}
