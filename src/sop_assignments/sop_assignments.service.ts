import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { SOPAssignment } from './sop_assignment.entity';
import { User } from 'src/users/user.entity';
import { UserGroup } from 'src/user_groups/user_group.entity';
import { SOP } from 'src/sops/sop.entity';
import { CreateSOPAssignmentDto } from './dto/create-sop_assignment.dto';

@Injectable()
export class SOPAssignmentsService {
  constructor(
    @InjectRepository(SOPAssignment)
    private readonly assignmentRepo: Repository<SOPAssignment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(UserGroup)
    private readonly groupRepo: Repository<UserGroup>,

    @InjectRepository(SOP)
    private readonly sopRepo: Repository<SOP>,
  ) { }

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
    if (!assignment) throw new NotFoundException('Assignment not found');
    return assignment;
  }

  async create(data: CreateSOPAssignmentDto): Promise<SOPAssignment> {
    const { user_name, group_name, sop_title } = data;

    if ((user_name && group_name) || (!user_name && !group_name)) {
      throw new BadRequestException(
        'Harus pilih salah satu: user_name atau group_name',
      );
    }

    const sop = await this.sopRepo.findOne({ where: { title: sop_title } });
    if (!sop) throw new NotFoundException(`SOP '${sop_title}' tidak ditemukan`);

    let user: User | null = null;
    let group: UserGroup | null = null;

    if (user_name) {
      user = await this.userRepo.findOne({ where: { username: user_name } });
      if (!user) throw new NotFoundException(`User '${user_name}' tidak ditemukan`);
    }

    if (group_name) {
      group = await this.groupRepo.findOne({ where: { group_name } });
      if (!group) throw new NotFoundException(`Group '${group_name}' tidak ditemukan`);
    }

    const assignment: DeepPartial<SOPAssignment> = {
      sop: { id: sop.id },
      user: user ? { id: user.id } : undefined,
      group: group ? { id: group.id } : undefined,
    };

    const saved = await this.assignmentRepo.save(assignment);

    return this.findOne(saved.id);

  }

  async remove(id: number): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentRepo.remove(assignment);
  }
}