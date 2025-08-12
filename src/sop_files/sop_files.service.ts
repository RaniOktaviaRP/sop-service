// src/sop_files/sop_files.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SOPFile } from './sop_file.entity';
import { SOP } from 'src/sops/sop.entity';
import * as path from 'path';

@Injectable()
export class SopFilesService {
  constructor(
    @InjectRepository(SOPFile)
    private readonly repo: Repository<SOPFile>,
  ) {}

  async createFromUpload(sopId: number, file: Express.Multer.File) {
    const sopFile = this.repo.create({
      file_name: file.originalname,
      file_type: path.extname(file.originalname).substring(1).toUpperCase(),
      file_path: 'stored-in-db',
      file_size: file.size,
      sop: { id: sopId }, // relasi ManyToOne
      // data: file.buffer // kalau simpan binary
    });

    return await this.repo.save(sopFile);
  }
}
