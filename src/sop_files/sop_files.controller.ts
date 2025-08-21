// src/sop_files/sop_files.controller.ts
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { SopFilesService } from './sop_files.service';

@Controller('sop-files')
export class SopFilesController {
  constructor(private readonly sopFilesService: SopFilesService) {}

  private getMimeType(fileType: string): string {
    switch (fileType.toLowerCase()) {
      case 'pdf': return 'application/pdf';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'png': return 'image/png';
      case 'doc': return 'application/msword';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default: return 'application/octet-stream';
    }
  }

  @Get(':id')
  async viewFile(@Param('id') id: number, @Res() res: Response) {
    const file = await this.sopFilesService.findOne(id);

    if (!file || !file.data) {
      return res.status(404).send('File not found');
    }

  
    res.setHeader('Content-Type', this.getMimeType(file.file_type));
    res.setHeader('Content-Disposition', 'inline; filename="' + file.file_name + '"');
    res.send(file.data);
  }
}
