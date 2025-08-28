import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, In } from 'typeorm';
import { SOPAssignment } from './sop_assignment.entity';
import { User } from 'src/users/user.entity';
import { UserGroup } from 'src/user_groups/user_group.entity';
import { SOP } from 'src/sops/sop.entity';
import { CreateSOPAssignmentDto } from './dto/create-sop_assignment.dto';
import { MailService } from 'src/mail/mail.service'; 

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

    private readonly mailService: MailService,
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
    if (!assignment) throw new NotFoundException('Assignment not found');
    return assignment;
  }

  async create(data: CreateSOPAssignmentDto): Promise<SOPAssignment> {
    const { sop_id, user_id, group_id } = data;

    if ((user_id && group_id) || (!user_id && !group_id)) {
      throw new BadRequestException('Harus pilih salah satu: user_id atau group_id');
    }

    const sop = await this.sopRepo.findOne({ where: { id: sop_id } });
    if (!sop) throw new NotFoundException(`SOP dengan id ${sop_id} tidak ditemukan`);

    let assignment: DeepPartial<SOPAssignment> = { sop_id: sop.id };

    if (user_id) {
      const user = await this.userRepo.findOne({ where: { id: user_id } });
      if (!user) throw new NotFoundException(`User dengan id ${user_id} tidak ditemukan`);
      assignment.user_id = user.id;

      // Kirim email ke user
      await this.mailService.sendAssignmentEmail(user.email, sop.title);

    } else if (group_id) {
      const group = await this.groupRepo.findOne({
        where: { id: group_id },
        relations: ['members', 'members.user'], // pastikan relasi member.user ada
      });
      if (!group) throw new NotFoundException(`Group dengan id ${group_id} tidak ditemukan`);
      assignment.group_id = group.id;

      // Kirim email ke semua anggota group
      for (const member of group.members) {
        await this.mailService.sendAssignmentEmail(member.user.email, sop.title);
      }
    }

    const saved = await this.assignmentRepo.save(assignment);
    return this.findOne(saved.id);
  }

  async createManyForUsers(sop_id: number, user_ids: number[]): Promise<SOPAssignment[]> {
    const sop = await this.sopRepo.findOne({ where: { id: sop_id } });
    if (!sop) throw new NotFoundException(`SOP dengan id ${sop_id} tidak ditemukan`);

    const users = await this.userRepo.find({ where: { id: In(user_ids) } });
    if (users.length !== user_ids.length) {
      throw new BadRequestException('Ada user_id yang tidak valid');
    }

    const assignments = users.map(user =>
      this.assignmentRepo.create({
        sop_id,
        user_id: user.id,
      }),
    );

    const saved = await this.assignmentRepo.save(assignments);

    // Kirim email ke semua user
    for (const user of users) {
      await this.mailService.sendAssignmentEmail(user.email, sop.title);
    }

    return this.assignmentRepo.find({
      where: { id: In(saved.map(a => a.id)) },
      relations: ['sop', 'user'],
      order: { assigned_at: 'DESC' },
    });
  }

  async remove(id: number): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentRepo.remove(assignment);
  }
}
