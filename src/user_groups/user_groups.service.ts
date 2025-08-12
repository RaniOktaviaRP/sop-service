import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGroup } from './user_group.entity';

@Injectable()
export class UserGroupsService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly groupRepo: Repository<UserGroup>,
  ) {}

  async findAll(): Promise<UserGroup[]> {
    return this.groupRepo.find({
      relations: ['members', 'assignments'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<UserGroup> {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: ['members', 'assignments'],
    });

    if (!group) {
      throw new NotFoundException('User group not found');
    }

    return group;
  }

  async create(data: Partial<UserGroup>): Promise<UserGroup> {
    const group = this.groupRepo.create(data);
    return this.groupRepo.save(group);
  }

  async update(id: number, data: Partial<UserGroup>): Promise<UserGroup> {
    const group = await this.findOne(id);
    Object.assign(group, data);
    return this.groupRepo.save(group);
  }

  async delete(id: number): Promise<void> {
    const group = await this.findOne(id);
    await this.groupRepo.remove(group);
  }
}
