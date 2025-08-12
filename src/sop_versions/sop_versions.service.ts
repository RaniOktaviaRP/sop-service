import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SOPVersion } from './sop_version.entity';
import { SOP } from 'src/sops/sop.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth'; // untuk DOCX

@Injectable()
export class SOPVersionsService {
  constructor(
    @InjectRepository(SOPVersion)
    private readonly versionRepo: Repository<SOPVersion>,

    @InjectRepository(SOP)
    private readonly sopRepo: Repository<SOP>,
  ) {}

  async createAutomatically(sop_id: number, file: Express.Multer.File) {
    const sop = await this.sopRepo.findOne({ where: { id: sop_id } });
    if (!sop) throw new NotFoundException('SOP not found');

    const ext = path.extname(file.originalname).toLowerCase().replace('.', ''); // pdf / docx

    if (!['pdf', 'docx'].includes(ext)) {
      throw new BadRequestException('Hanya mendukung file PDF atau DOCX');
    }

    const fileType = ext.toUpperCase(); // 'PDF' / 'DOCX'

    // Generate version number
    const lastVersion = await this.versionRepo.findOne({
      where: { sop_id },
      order: { uploaded_at: 'DESC' },
    });
    const nextVersion = lastVersion
      ? (parseFloat(lastVersion.version_number) + 0.1).toFixed(1)
      : '1.0';

    // Ekstrak konten teks
    let text_content = '';
    const buffer = fs.readFileSync(file.path);

    try {
      if (fileType === 'PDF') {
        const data = await pdfParse(buffer);
        text_content = data.text;
      } else if (fileType === 'DOCX') {
        const result = await mammoth.extractRawText({ path: file.path });
        text_content = result.value;
      }
    } catch (err) {
      console.error('Gagal ekstrak teks:', err.message);
    }

    const version = this.versionRepo.create({
      sop_id,
      version_number: nextVersion,
      file_path: file.path,
      file_type: fileType,
      text_content,
      changelog: `Upload file ${file.originalname}`,
      uploaded_by_user_id: 1, // nanti diganti dari req.user.id
    });

    const saved = await this.versionRepo.save(version);

    // Update current version di tabel SOP
    sop.current_version_id = saved.id;
    await this.sopRepo.save(sop);

    return saved;
  }
}
