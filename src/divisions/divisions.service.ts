import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Division } from './division.entity';

@Injectable()
export class DivisionsService {
  constructor(
    @InjectRepository(Division)
    private readonly divisionRepo: Repository<Division>,
  ) {}

  async findAll(): Promise<Division[]> {
    return this.divisionRepo.find({
      relations: ['users', 'sops'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Division> {
    const division = await this.divisionRepo.findOne({
      where: { id },
      relations: ['users', 'sops'],
    });

    if (!division) {
      throw new NotFoundException('Division not found');
    }

    return division;
  }

  async create(data: Partial<Division>): Promise<Division> {
    const division = this.divisionRepo.create(data);
    return this.divisionRepo.save(division);
  }

  async update(id: number, data: Partial<Division>): Promise<Division> {
    const division = await this.findOne(id);
    Object.assign(division, data);
    return this.divisionRepo.save(division);
  }

  async delete(id: number): Promise<void> {
    const division = await this.findOne(id);
    await this.divisionRepo.remove(division);
  }
}
