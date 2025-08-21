import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { SOPVersion } from './sop_version.entity';
import { SOP } from 'src/sops/sop.entity';
import { SOPFile } from 'src/sop_files/sop_file.entity';
import * as path from 'path';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

@Injectable()
export class SOPVersionsService {
  constructor(
    @InjectRepository(SOPVersion)
    private readonly versionRepo: Repository<SOPVersion>,

    @InjectRepository(SOP)
    private readonly sopRepo: Repository<SOP>,

    @InjectRepository(SOPFile)
    private readonly fileRepo: Repository<SOPFile>,
  ) {}

  async createAutomatically(
    sop_id: number,
    file: Express.Multer.File,
    uploadedByUserId?: number, 
  ) {
    const sop = await this.sopRepo.findOne({ where: { id: sop_id } });
    if (!sop) throw new NotFoundException('SOP tidak ditemukan');

    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (!['pdf', 'docx'].includes(ext)) {
      throw new BadRequestException('Hanya mendukung file PDF atau DOCX');
    }
    const fileType = ext.toUpperCase();

    // Ambil versi terakhir
    const lastVersion = await this.versionRepo.findOne({
      where: { sop: { id: sop_id } },
      order: { uploaded_at: 'DESC' },
    });
    const nextVersion = lastVersion
      ? (parseFloat(lastVersion.version_number) + 0.1).toFixed(1)
      : '1.0';

    const sopFile = this.fileRepo.create({
      file_name: file.originalname,
      file_type: fileType,
      file_size: file.size,
      data: file.buffer,
      file_path: file.originalname,
      sop,
    });
    const savedFile = await this.fileRepo.save(sopFile);

    // Ekstrak teks dari file
    let text_content = '';
    try {
      if (fileType === 'PDF') {
        const data = await pdfParse(savedFile.data);
        text_content = data.text;
      } else if (fileType === 'DOCX') {
        const result = await mammoth.extractRawText({ buffer: savedFile.data });
        text_content = result.value;
      }
    } catch (err) {
      console.error('Gagal ekstrak teks:', err.message);
    }

    const versionData: DeepPartial<SOPVersion> = {
      sop_id: sop.id,
      version_number: nextVersion,
      file_path: savedFile.file_path,
      file_type: fileType,
      text_content,
      changelog: `Upload file ${file.originalname}`,
      uploaded_by_user_id: uploadedByUserId ?? undefined,
      approved_by_user_id: undefined,
    };

    const version = this.versionRepo.create(versionData);
    const savedVersion = await this.versionRepo.save(version);

    // update SOP
    sop.current_version_id = savedVersion.id;
    await this.sopRepo.save(sop);


    return {
      ...savedVersion,
      preview_text: text_content ? text_content.substring(0, 500) : null, 
    };
  }
}
