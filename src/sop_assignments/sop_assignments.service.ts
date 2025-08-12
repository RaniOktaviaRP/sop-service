import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SOPAssignment } from './sop_assignment.entity';

@Injectable()
export class SOPAssignmentsService {
  constructor(
    @InjectRepository(SOPAssignment)
    private readonly assignmentRepo: Repository<SOPAssignment>,
  ) {}

  async findAll(): Promise<SOPAssignment[]> {
    return this.assignmentRepo.find({
      relations: ['sop', 'user', 'group'],
      order: { assigned_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SOPAssignment> {
    const assignment = await this.assignmentRepo.findOne({
      where: { id },
      relations: ['sop', 'user', 'group'],
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    return assignment;
  }

  async create(data: Partial<SOPAssignment>): Promise<SOPAssignment> {
    const { user_id, group_id } = data;

    // Validasi: hanya boleh salah satu yang diisi
    if (!user_id && !group_id) {
      throw new BadRequestException('Either user_id or group_id must be provided');
    }
    if (user_id && group_id) {
      throw new BadRequestException('Only one of user_id or group_id must be provided, not both');
    }

    const assignment = this.assignmentRepo.create(data);
    return this.assignmentRepo.save(assignment);
  }

  async delete(id: number): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentRepo.remove(assignment);
  }
}
