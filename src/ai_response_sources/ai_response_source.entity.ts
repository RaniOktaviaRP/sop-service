import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AIQuery } from '../ai_queries/ai_query.entity';
import { SOP } from 'src/sops/sop.entity';
import { SOPVersion } from 'src/sop_versions/sop_version.entity';

@Entity('ai_response_sources')
export class AIResponseSource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  query_id: number;

  @ManyToOne(() => AIQuery, q => q.sources)
  @JoinColumn({ name: 'query_id' })
  query: AIQuery;

  @Column()
  sop_id: number;

  @ManyToOne(() => SOP)
  @JoinColumn({ name: 'sop_id' })
  sop: SOP;

  @Column()
  version_id: number;

  @ManyToOne(() => SOPVersion)
  @JoinColumn({ name: 'version_id' })
  version: SOPVersion;

  @Column({ type: 'float', nullable: true })
  relevance_score: number;
}
