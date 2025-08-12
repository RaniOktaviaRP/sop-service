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

@Injectable()
export class SopsService {
  constructor(
    @InjectRepository(SOP)
    private readonly sopRepo: Repository<SOP>,

    private readonly dataSource: DataSource,
  ) {}

async create(dto: CreateSOPDto): Promise<SOP> {
  const sop = this.sopRepo.create({
    ...dto,
    status: dto.status ?? 'Pending Review', // ⬅️ pakai status dari DTO, kalau kosong pakai default
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
    const sop = await this.findOne(id);

    // Validasi: jika status Revisi/Rejected maka wajib isi alasan
    if (dto.status && ['Revisi', 'Rejected'].includes(dto.status)) {
      if (!dto.status_reason || dto.status_reason.trim() === '') {
        throw new BadRequestException(
          `Alasan harus diisi saat status ${dto.status}`,
        );
      }
    }

    // Jika status_reason diisi, tapi status bukan Revisi/Rejected, abaikan
    if (
      dto.status_reason &&
      (!dto.status || !['Revisi', 'Rejected'].includes(dto.status))
    ) {
      dto.status_reason = undefined;
    }

    Object.assign(sop, dto);
    return await this.sopRepo.save(sop);
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
}
