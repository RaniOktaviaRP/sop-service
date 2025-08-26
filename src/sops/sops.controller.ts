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
  UseGuards,
  Request,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SopsService } from './sops.service';
import { SOPVersionsService } from 'src/sop_versions/sop_versions.service';
import { CreateSOPDto } from './dto/create-sop.dto';
import { UpdateSOPDto } from './dto/update-sop.dto';
import { SOPStatus } from './dto/create-sop.dto';
import { SopFilesService } from 'src/sop_files/sop_files.service';
import { SOPVersion } from 'src/sop_versions/sop_version.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

interface ApiResponseType<T> {
  data: T;
  message: string;
}

@ApiTags('SOP')
@Controller('sops')
export class SopsController {
  constructor(
    private readonly sopsService: SopsService,
    private readonly sopVersionsService: SOPVersionsService,
    private readonly sopFilesService: SopFilesService,
  ) { }


  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @ApiOperation({ summary: 'Buat SOP baru' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        category_name: { type: 'string' },
        division_name: { type: 'string' },
        status: { type: 'string', enum: Object.values(SOPStatus) },
        tags: { type: 'string', description: 'JSON string array, misal: ["tag1","tag2"]' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'File SOP, format PDF atau DOCX, max 10MB',
        },
      },
      required: ['title', 'description', 'category_name', 'division_name'],
    },
  })
  @ApiResponse({ status: 201, description: 'SOP berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Validasi gagal atau file tidak sesuai' })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) {
          return cb(new BadRequestException('Hanya file PDF atau DOCX yang diperbolehkan'), false);
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
    @Body('tags') rawTags?: string | string[],
  ): Promise<ApiResponseType<any>> {
    if (!title || !description || !category_name || !division_name) {
      throw new BadRequestException('Semua field wajib diisi (kecuali file)');
    }

    const category = await this.sopsService.findCategoryByName(category_name);
    if (!category) throw new BadRequestException(`Kategori "${category_name}" tidak ditemukan`);

    const division = await this.sopsService.findDivisionByName(division_name);
    if (!division) throw new BadRequestException(`Divisi "${division_name}" tidak ditemukan`);

    const allowedStatus = Object.values(SOPStatus);
    const finalStatus: SOPStatus =
      status && allowedStatus.includes(status as SOPStatus)
        ? (status as SOPStatus)
        : SOPStatus.PendingReview;

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

    let versionData;
    if (file) {
      versionData = await this.sopVersionsService.createAutomatically(sop.id, file);
    }

    return {
      data: {
        ...sop,
        current_version: versionData ?? null,
      },
      message: file
        ? 'SOP berhasil dibuat dan versi terbaru tersimpan.'
        : 'SOP berhasil dibuat.',
    };
  }


  // 🔹 GET ALL SOP (hanya untuk division user yg login)
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin', 'Employee')
  @Get()
  async findAll(
    @Request() req,
    @Query('divisionId') divisionId?: number,
    @Query('groupId') groupId?: number,
    @Query('userId') userId?: number
  ): Promise<ApiResponseType<any>> {

    console.log("👉 Token dari header:", req.headers.authorization);
    console.log("👉 Payload hasil verify:", req.user);

    // Default: gunakan division_id dari token jika tidak dikirim query param
    const divId = divisionId || req.user.division_id;

    // Panggil service dengan filter
    const sops = await this.sopsService.findFiltered({
      divisionId: divId,
      groupId,
      userId
    });

    return { data: sops, message: 'SOP list retrieved successfully' };
  }


  @Get(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin', 'Employee')
  @ApiOperation({ summary: 'Ambil SOP berdasarkan ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseType<any>> {
    const sop = await this.sopsService.findOne(id);
    return { data: sop, message: 'SOP retrieved successfully' };
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')

  @ApiOperation({ summary: 'Update SOP berdasarkan id' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        category_name: { type: 'string' },
        division_name: { type: 'string' },
        status: { type: 'string', enum: Object.values(SOPStatus) },
        status_reason: { type: 'string' },
        tags: { type: 'string', description: 'JSON string array, misal: ["tag1","tag2"]' },
        file: {
          type: 'string',
          format: 'binary',
          description: 'File SOP, format PDF atau DOCX, max 10MB',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) {
          return cb(new BadRequestException('Hanya file PDF atau DOCX yang diperbolehkan'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updateFormData(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title?: string,
    @Body('description') description?: string,
    @Body('category_name') category_name?: string,
    @Body('division_name') division_name?: string,
    @Body('status') status?: string,
    @Body('status_reason') status_reason?: string,
    @Body('tags') rawTags?: string | string[],
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<ApiResponseType<any>> {
    const dto: UpdateSOPDto = {};

    if (title) dto.title = title;
    if (description) dto.description = description;

    if (category_name) {
      const category = await this.sopsService.findCategoryByName(category_name);
      if (!category) throw new BadRequestException(`Kategori "${category_name}" tidak ditemukan`);
      dto.category_id = category.id;
    }

    if (division_name) {
      const division = await this.sopsService.findDivisionByName(division_name);
      if (!division) throw new BadRequestException(`Divisi "${division_name}" tidak ditemukan`);
      dto.division_id = division.id;
    }

    if (status) {
      const allowedStatus = Object.values(SOPStatus);
      if (!allowedStatus.includes(status as SOPStatus)) {
        throw new BadRequestException(`Status tidak valid. Pilih salah satu: ${allowedStatus.join(', ')}`);
      }
      dto.status = status as SOPStatus;
    }

    if (status_reason) {
      dto.status_reason = status_reason;
    }

    if (rawTags) {
      if (typeof rawTags === 'string') {
        try {
          const parsed = JSON.parse(rawTags);
          dto.tags = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          dto.tags = [rawTags];
        }
      } else if (Array.isArray(rawTags)) {
        dto.tags = rawTags;
      }
    }

    const updatedSop = await this.sopsService.update(id, dto);

    let versionData: SOPVersion | null = null;
    if (file) {
      versionData = await this.sopVersionsService.createAutomatically(updatedSop.id, file);
    }

    return {
      data: {
        ...updatedSop,
        current_version: versionData ?? null,
      },
      message: file
        ? 'SOP berhasil diperbarui dan versi baru tersimpan.'
        : 'SOP berhasil diperbarui.',
    };
  }

  @Get('user/:userId')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin', 'Employee')
  @ApiOperation({ summary: 'Ambil SOP berdasarkan user ID' })
  async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<ApiResponseType<any>> {
    const sops = await this.sopsService.findByUser(userId);
    return { data: sops, message: 'SOPs retrieved successfully for user' };
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')

  @ApiOperation({ summary: 'Hapus SOP berdasarkan ID' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseType<null>> {
    await this.sopsService.remove(id);
    return { data: null, message: 'SOP deleted successfully' };
  }

  @Get(':id/preview')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin', 'Employee')
  @ApiOperation({ summary: 'Lihat preview text_content dari SOP terbaru' })
  @ApiParam({ name: 'id', type: Number, description: 'ID SOP' })
  @ApiResponse({ status: 200, description: 'Preview text dari file SOP' })
  async getSopPreview(@Param('id', ParseIntPipe) sopId: number) {
    // cari versi terbaru berdasarkan sop_id
    const latestVersion = await this.sopVersionsService.findLatestBySopId(sopId);

    if (!latestVersion) throw new NotFoundException('Versi SOP tidak ditemukan');

    return {
      sop_id: sopId,
      version_id: latestVersion.id,
      preview_text: latestVersion.text_content
        ? latestVersion.text_content.substring(0, 1000)
        : null,
    };
  }
}
