import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMember } from './group_member.entity';
import { UserGroupsService } from 'src/user_groups/user_groups.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class GroupMembersService {
  constructor(
    @InjectRepository(GroupMember)
    private readonly memberRepo: Repository<GroupMember>,

    private readonly userGroupsService: UserGroupsService,
    private readonly usersService: UsersService,
    
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
    if (!member) throw new NotFoundException('Group member not found');
    return member;
  }

  async create(data: Partial<GroupMember>): Promise<GroupMember> {
    const member = this.memberRepo.create(data);
    return await this.memberRepo.save(member);
  }

  async update(id: number, data: Partial<GroupMember>): Promise<GroupMember> {
    const member = await this.findOne(id);
    Object.assign(member, data);
    return await this.memberRepo.save(member);
  }

  async delete(id: number): Promise<void> {
    const member = await this.findOne(id);
    await this.memberRepo.remove(member);
  }

  async findByGroup(group_id: number): Promise<GroupMember[]> {
    return this.memberRepo.find({
      where: { group_id },
      relations: ['user'],
      order: { id: 'ASC' },
    });
  }

  async findByUser(user_id: number): Promise<GroupMember[]> {
    return this.memberRepo.find({
      where: { user_id },
      relations: ['group'],
      order: { id: 'ASC' },
    });
  }

// ✅ Versi pakai ID
async createById(data: { group_id: number; user_id: number }): Promise<GroupMember> {
  const { group_id, user_id } = data;

  // Cek apakah group & user valid
  const group = await this.userGroupsService.findOne(group_id);
  if (!group) throw new BadRequestException(`Group dengan id ${group_id} tidak ditemukan`);

  // 🔧 convert ke string
  const user = await this.usersService.findOne(String(user_id));
  if (!user) throw new BadRequestException(`User dengan id ${user_id} tidak ditemukan`);

  // Cek apakah user sudah ada di group_members
  const existingMember = await this.memberRepo.findOne({
    where: { user_id, group_id },
  });
  if (existingMember) {
    throw new BadRequestException(
      `User '${user.username}' sudah ada di group '${group.group_name}'`,
    );
  }

  // Buat record di table group_members
  const member = this.memberRepo.create({ group_id, user_id });
  await this.memberRepo.save(member);

  // Update relasi user.group
  user.group = group;
  await this.usersRepository.save(user);

  // Return member dengan relasi lengkap
  const newMember = await this.memberRepo.findOne({
    where: { id: member.id },
    relations: ['user', 'group'],
  });

  if (!newMember) throw new NotFoundException('Member tidak ditemukan setelah dibuat');
  return newMember;
}
}