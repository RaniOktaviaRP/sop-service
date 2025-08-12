import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { SopsService } from './sops.service';
import { SOPVersionsService } from 'src/sop_versions/sop_versions.service';
import { CreateSOPDto } from './dto/create-sop.dto';
import { UpdateSOPDto } from './dto/update-sop.dto';
import { SOPStatus } from './dto/create-sop.dto';
import { SopFilesService } from 'src/sop_files/sop_files.service';

@Controller('sops')
export class SopsController {
  constructor(
    private readonly sopsService: SopsService,
    private readonly sopVersionsService: SOPVersionsService,
    private readonly sopFilesService: SopFilesService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
      fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) {
          return cb(
            new BadRequestException('Hanya file PDF atau DOCX yang diperbolehkan'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  
  async create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('category_name') category_name: string,
    @Body('division_name') division_name: string,
    @Body('status') status?: string,
    @Body('tags') rawTags?: string | string[]
  ) {
    // Validasi field wajib
    if (!title || !description || !category_name || !division_name) {
      throw new BadRequestException('Semua field wajib diisi (kecuali file)');
    }

    // Cari ID category dan division berdasarkan nama
    const category = await this.sopsService.findCategoryByName(category_name);
    if (!category) {
      throw new BadRequestException(`Kategori "${category_name}" tidak ditemukan`);
    }

    const division = await this.sopsService.findDivisionByName(division_name);
    if (!division) {
      throw new BadRequestException(`Divisi "${division_name}" tidak ditemukan`);
    }

    // Default status menjadi Pending Review
    const allowedStatus = Object.values(SOPStatus);
    const finalStatus: SOPStatus =
      status && allowedStatus.includes(status as SOPStatus)
        ? (status as SOPStatus)
        : SOPStatus.PendingReview;

    // ✅ Normalisasi tags jadi array string
    let tags: string[] | undefined;
    if (typeof rawTags === 'string') {
      try {
        const parsed = JSON.parse(rawTags);
        tags = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        tags = [rawTags]; 
      }
    } else if (Array.isArray(rawTags)) {
      tags = rawTags;
    }

    const dto: CreateSOPDto = {
      title,
      description,
      category_id: category.id,
      division_id: division.id,
      status: finalStatus,
      tags, 
    };

    const sop = await this.sopsService.create(dto);

    // Simpan file ke tabel sop_files jika ada
    if (file) {
      await this.sopFilesService.createFromUpload(sop.id, file);
    }

    return {
      message: file
        ? '✅ SOP berhasil dibuat dan file berhasil disimpan ke database.'
        : '✅ SOP berhasil dibuat (tanpa file).',
      sop,
    };
  }

  @Get()
  findAll() {
    return this.sopsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sopsService.findOne(id);
  }
  
@Patch(':id')
@UseInterceptors(
  FileInterceptor('file', {
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
      const allowed = ['.pdf', '.docx'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowed.includes(ext)) {
        return cb(
          new BadRequestException('Hanya file PDF atau DOCX yang diperbolehkan'),
          false,
        );
      }
      cb(null, true);
    },
  }),
)
async updateFormData(
  @Param('id', ParseIntPipe) id: number,
  @UploadedFile() file: Express.Multer.File | undefined,
  @Body('title') title?: string,
  @Body('description') description?: string,
  @Body('status') status?: string,
  @Body('status_reason') status_reason?: string,
  @Body('tags') rawTags?: string | string[],
) {
  // Normalisasi tags
  let tags: string[] | undefined;
  if (typeof rawTags === 'string') {
    try {
      const parsed = JSON.parse(rawTags);
      tags = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      tags = [rawTags];
    }
  } else if (Array.isArray(rawTags)) {
    tags = rawTags;
  }

  const dto: UpdateSOPDto = {
    title,
    description,
    status: status as any,
    status_reason,
    tags,
  };

  const updatedSop = await this.sopsService.update(id, dto);

  // Jika ada file baru, simpan file ke DB
  if (file) {
    await this.sopFilesService.createFromUpload(id, file);
  }

  return {
    message: file
      ? '✅ SOP berhasil diperbarui dan file baru disimpan.'
      : '✅ SOP berhasil diperbarui.',
    sop: updatedSop,
  };
}

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sopsService.remove(id);
  }
}
