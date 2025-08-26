import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SOP } from './sop.entity';
import { CreateSOPDto } from './dto/create-sop.dto';
import { UpdateSOPDto } from './dto/update-sop.dto';
import { Category } from 'src/categories/category.entity';
import { Division } from 'src/divisions/division.entity';
import { SOPAssignment } from 'src/sop_assignments/sop_assignment.entity';

@Injectable()
export class SopsService {
  constructor(
    @InjectRepository(SOP)
    private readonly sopRepo: Repository<SOP>,

    @InjectRepository(SOPAssignment)
    private readonly sopAssignmentRepo: Repository<SOPAssignment>,

    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateSOPDto): Promise<SOP> {
    const sop = this.sopRepo.create({
      ...dto,
      status: dto.status ?? 'Pending Review', // default jika kosong
    });
    return await this.sopRepo.save(sop);
  }

  async findAll(): Promise<SOP[]> {
    return await this.sopRepo.find({
      relations: ['category', 'division', 'created_by_user'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SOP> {
    const sop = await this.sopRepo.findOne({
      where: { id },
      relations: ['category', 'division', 'created_by_user', 'versions'],
    });
    if (!sop) throw new NotFoundException(`SOP with id ${id} not found`);
    return sop;
  }

  async update(id: number, dto: UpdateSOPDto): Promise<SOP> {
    const sop = await this.sopRepo.findOne({ where: { id } });
    if (!sop) {
      throw new NotFoundException(`SOP dengan id ${id} tidak ditemukan`);
    }

    if (dto.status && ['Revisi', 'Rejected'].includes(dto.status)) {
      if (!dto.status_reason || dto.status_reason.trim() === '') {
        throw new BadRequestException(
          `Alasan harus diisi saat status ${dto.status}`,
        );
      }
    } else {
      dto.status_reason = undefined;
    }

    Object.assign(sop, dto);
    await this.sopRepo.save(sop);

    const updated = await this.sopRepo.findOne({
      where: { id },
      relations: ['category', 'division'],
    });

    if (!updated) {
      throw new NotFoundException(
        `SOP dengan id ${id} tidak ditemukan setelah update`,
      );
    }

    return updated;
  }

  async remove(id: number): Promise<void> {
    const sop = await this.findOne(id);
    await this.sopRepo.remove(sop);
  }

  async findCategoryByName(name: string): Promise<Category | null> {
    return await this.dataSource.getRepository(Category).findOne({
      where: { category_name: name },
    });
  }

  async findDivisionByName(name: string): Promise<Division | null> {
    return await this.dataSource.getRepository(Division).findOne({
      where: { division_name: name },
    });
  }

  async findByUser(userId: number): Promise<SOP[]> {
    return await this.dataSource
      .getRepository(SOP)
      .createQueryBuilder('sop')
      .innerJoin('sop.division', 'division')
      .innerJoin('users', 'u', 'u.division_id = division.id')
      .where('u.id = :userId', { userId })
      .getMany();
  }

  async findByDivision(divisionId: number): Promise<SOP[]> {
    return await this.sopRepo.find({
      where: { division: { id: divisionId } },
      relations: ['category', 'division', 'created_by_user', 'versions'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUserOrDivision(userId: number, divisionId: number): Promise<SOP[]> {
    const divisionSops = await this.findByDivision(divisionId);

    const assignments = await this.sopAssignmentRepo.find({
      where: [
        { user: { id: userId } },
        { group: { users: { id: userId } } }, 
      ],
      relations: ['sop'],
    });

    const assignedSops = assignments.map(a => a.sop);

    const allSops = [...divisionSops, ...assignedSops];
    const uniqueSops = Array.from(new Map(allSops.map(s => [s.id, s])).values());

    return uniqueSops;
  }

  async findFiltered(filters: { divisionId?: number; groupId?: number; userId?: number }): Promise<SOP[]> {
  const query = this.sopRepo
    .createQueryBuilder('sop')
    .leftJoinAndSelect('sop.category', 'category')
    .leftJoinAndSelect('sop.division', 'division')
    .leftJoinAndSelect('sop.created_by_user', 'creator')
    .leftJoinAndSelect('sop.versions', 'versions')
    .leftJoinAndSelect('sop.sopAssignments', 'assignment')
    .leftJoinAndSelect('assignment.user', 'assignedUser')
    .leftJoinAndSelect('assignment.group', 'assignedGroup');

  // Filter berdasarkan divisi
  if (filters.divisionId) {
    query.andWhere('division.id = :divisionId', { divisionId: filters.divisionId });
  }

  // Filter berdasarkan user yang di-assign
  if (filters.userId) {
    query.andWhere('(assignedUser.id = :userId OR sop.created_by_user.id = :userId)', { userId: filters.userId });
  }

  // Filter berdasarkan group
  if (filters.groupId) {
    query.andWhere('assignedGroup.id = :groupId', { groupId: filters.groupId });
  }

  query.orderBy('sop.created_at', 'DESC');

  const sops = await query.getMany();

  return sops;
}

async findByAssignments(userId: number, divisionId: number): Promise<SOP[]> {
  // SOP untuk divisi user
  const divisionSops = await this.findByDivision(divisionId);

  // SOP yang diassign ke user atau grup user
  const assignments = await this.sopAssignmentRepo.find({
    where: [
      { user: { id: userId } },
      { group: { users: { id: userId } } }, 
    ],
    relations: ['sop'],
  });
  const assignedSops = assignments.map(a => a.sop);

  // Gabungkan dan hilangkan duplikat
  const allSops = [...divisionSops, ...assignedSops];
  const uniqueSops = Array.from(new Map(allSops.map(s => [s.id, s])).values());

  return uniqueSops;
}


}
