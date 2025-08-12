import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from 'src/users/user.entity';
import { AIResponseSource } from '../ai_response_sources/ai_response_source.entity';

@Entity('ai_queries')
export class AIQuery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('text')
  query_text: string;

   @Column({ nullable: true })
  ai_response_text: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ nullable: true })
  feedback: string;

  @OneToMany(() => AIResponseSource, rs => rs.query)
  sources: AIResponseSource[];
}
