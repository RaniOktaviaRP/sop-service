import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMember } from './group_member.entity';

@Injectable()
export class GroupMembersService {
  constructor(
    @InjectRepository(GroupMember)
    private readonly memberRepo: Repository<GroupMember>,
  ) {}

  async findAll(): Promise<GroupMember[]> {
    return this.memberRepo.find({
      relations: ['group', 'user'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<GroupMember> {
    const member = await this.memberRepo.findOne({
      where: { id },
      relations: ['group', 'user'],
    });

    if (!member) {
      throw new NotFoundException('Group member not found');
    }

    return member;
  }

  async create(data: Partial<GroupMember>): Promise<GroupMember> {
    const member = this.memberRepo.create(data);
    return this.memberRepo.save(member);
  }

  async update(id: number, data: Partial<GroupMember>): Promise<GroupMember> {
    const member = await this.findOne(id);
    Object.assign(member, data);
    return this.memberRepo.save(member);
  }

  async delete(id: number): Promise<void> {
    const member = await this.findOne(id);
    await this.memberRepo.remove(member);
  }

  async findByGroup(group_id: number): Promise<GroupMember[]> {
    return this.memberRepo.find({
      where: { group_id },
      relations: ['user'],
    });
  }

  async findByUser(user_id: number): Promise<GroupMember[]> {
    return this.memberRepo.find({
      where: { user_id },
      relations: ['group'],
    });
  }
}
