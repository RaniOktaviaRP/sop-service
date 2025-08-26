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
    });
  }

  async findByUser(user_id: number): Promise<GroupMember[]> {
    return this.memberRepo.find({
      where: { user_id },
      relations: ['group'],
    });
  }

  // Fungsi baru: createByName
  async createByName(data: { group_name: string; user_name: string }): Promise<GroupMember> {
    // Cari group
    const group = await this.userGroupsService.findByName(data.group_name);
    if (!group) throw new BadRequestException(`Group '${data.group_name}' tidak ditemukan`);

    // Cari user
    const user = await this.usersService.findByName(data.user_name);
    if (!user) throw new BadRequestException(`User '${data.user_name}' tidak ditemukan`);

    // Cek apakah user sudah ada di group_members
    const existingMember = await this.memberRepo.findOne({
      where: { user_id: user.id, group_id: group.id },
    });
    if (existingMember)
      throw new BadRequestException(`User '${data.user_name}' sudah berada di group '${data.group_name}'`);

    // Buat record di table group_members
    const member = this.memberRepo.create({
      group_id: group.id,
      user_id: user.id,
    });
    await this.memberRepo.save(member);


    // Update users.group_id langsung dengan query builder
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ group: group }) 
      .where("id = :id", { id: user.id })
      .execute();

    const updatedUser = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['group'],
    });

    if (updatedUser) {
      console.log(`Updated user.group_id: ${updatedUser.group?.id}`);
    } else {
      console.log(`User dengan id ${user.id} tidak ditemukan setelah update`);
    }

    return member;
  }
}
