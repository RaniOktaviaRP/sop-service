import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SOPVersion } from './sop_version.entity';

@ApiTags('SOP Versions')
@Controller('sop-versions')
export class SOPVersionsController {
  constructor(
    @InjectRepository(SOPVersion)
    private readonly versionRepo: Repository<SOPVersion>,
  ) {}

  @Get(':id/preview')
  @ApiOperation({ summary: 'Lihat isi text_content dari SOP Version' })
  @ApiParam({ name: 'id', type: Number, description: 'ID SOP Version' })
  @ApiResponse({ status: 200, description: 'Preview text dari file' })
  async getPreview(@Param('id') id: number) {
    const version = await this.versionRepo.findOne({ where: { id } });
    if (!version) throw new NotFoundException('SOP Version tidak ditemukan');

    return {
      preview_text: version.text_content
        ? version.text_content.substring(0, 1000) 
        : null,
    };
  }
}
