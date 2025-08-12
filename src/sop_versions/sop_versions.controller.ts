import {
  Controller, Post, Param, UploadedFile, UseInterceptors, ParseIntPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SOPVersionsService } from './sop_versions.service';
import * as path from 'path';

@Controller('sop-versions')
export class SOPVersionsController {
  constructor(private readonly service: SOPVersionsService) {}

  @Post('upload/:sopId')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    }),
  }))
  
  async upload(
    @Param('sopId', ParseIntPipe) sopId: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.service.createAutomatically(sopId, file);
  }
}
