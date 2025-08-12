import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('approval_workflows')
export class ApprovalWorkflow {
  @PrimaryGeneratedColumn()
  workflow_id: number;

  @Column()
  workflow_name: string;

  @Column('text')
  description: string;

  @Column('json')
  steps: any; // array json seperti: [{ role: 'Reviewer', user_id: 2 }]
}
