import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import { Division } from '../divisions/division.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Division)
    private divisionRepo: Repository<Division>,
  ) {}

  // Buat user baru
  async create(dto: CreateUserDto) {
    const division = await this.divisionRepo.findOne({
      where: { division_name: dto.division_name },
    });

    if (!division) {
      throw new NotFoundException(`Division "${dto.division_name}" not found`);
    }

    const roleToSave = dto.role ?? UserRole.Employee;

    const newUser = this.userRepo.create({
      username: dto.username,
      password_hash: dto.password_hash,
      email: dto.email,
      full_name: dto.full_name,
      role: roleToSave,
      division_id: division.id,
    });

    return this.userRepo.save(newUser);
  }


  findAll() {
    return this.userRepo.find();
  }


  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id: Number(id) } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }


  async findByName(name: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username: name } });
  }


  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepo.preload({ id, ...dto });
    if (!user) throw new NotFoundException('User not found');
    return this.userRepo.save(user);
  }


  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepo.remove(user);
  }
}
