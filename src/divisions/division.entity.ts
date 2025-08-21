import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from 'src/users/user.entity';
import { SOP } from 'src/sops/sop.entity';
import { ApiProperty } from "@nestjs/swagger";

@Entity('divisions')
export class Division {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  division_name: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @OneToMany(() => User, user => user.division)
  users: User[];

  @OneToMany(() => SOP, sop => sop.division)
  sops: SOP[];
}
