import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SOPFile } from './sop_file.entity';
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
      file_size: file.size,
      data: file.buffer,
      sop: { id: sopId },
    });

    return await this.repo.save(sopFile);
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id } });
  }
}
