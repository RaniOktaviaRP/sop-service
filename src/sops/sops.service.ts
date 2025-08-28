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
import { User } from 'src/users/user.entity';
import { MailService } from 'src/mail/mail.service'; // ✅ untuk kirim email

@Injectable()
export class SopsService {
  constructor(
    @InjectRepository(SOP)
    private readonly sopRepo: Repository<SOP>,

    @InjectRepository(SOPAssignment)
    private readonly sopAssignmentRepo: Repository<SOPAssignment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>, // ✅ ambil user divisi

    private readonly dataSource: DataSource,
    private readonly mailService: MailService, // ✅ inject MailService
  ) {}

  async create(dto: CreateSOPDto): Promise<SOP> {
    const sop = this.sopRepo.create({
      ...dto,
      status: dto.status ?? 'Pending Review', // default jika kosong
    });
    const savedSop = await this.sopRepo.save(sop);

    // ✅ otomatis assign ke semua user divisi kalau division_id ada
    if (dto.division_id) {
      const users = await this.userRepo.find({
        where: { division: { id: dto.division_id } },
        relations: ['division'],
      });

      if (users.length > 0) {
        const assignments = users.map(user =>
          this.sopAssignmentRepo.create({
            sop: savedSop,
            user,
          }),
        );
        await this.sopAssignmentRepo.save(assignments);

        // Kirim email notifikasi ke semua user divisi
        for (const user of users) {
          await this.mailService.sendAssignmentEmail(user.email, savedSop.title);
        }
      }
    }

    return savedSop;
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

    if (filters.divisionId) {
      query.andWhere('division.id = :divisionId', { divisionId: filters.divisionId });
    }

    if (filters.userId) {
      query.andWhere('(assignedUser.id = :userId OR sop.created_by_user.id = :userId)', { userId: filters.userId });
    }

    if (filters.groupId) {
      query.andWhere('assignedGroup.id = :groupId', { groupId: filters.groupId });
    }

    query.orderBy('sop.created_at', 'DESC');

    return await query.getMany();
  }

  async findByAssignments(userId: number, divisionId: number): Promise<SOP[]> {
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

  async findAccessibleSops(userId: number, divisionId: number) {
    return this.sopRepo
      .createQueryBuilder('sop')
      .leftJoinAndSelect('sop.sopAssignments', 'assignment')
      .leftJoinAndSelect('assignment.group', 'group')
      .leftJoinAndSelect('group.members', 'groupMember')
      .where('sop.division_id = :divisionId', { divisionId })
      .orWhere('assignment.user_id = :userId', { userId })
      .orWhere('groupMember.user_id = :userId', { userId })
      .getMany();
  }
}
