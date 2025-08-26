import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { DivisionsService } from './divisions.service';
import { Division } from './division.entity';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

interface ApiResponseType<T> {
  data: T;
  message: string;
}

@ApiTags('Divisions')
@Controller('divisions')
export class DivisionsController {
  constructor(private readonly service: DivisionsService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil semua divisi' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil daftar divisi' })
  async findAll(): Promise<ApiResponseType<Division[]>> {
    const divisions = await this.service.findAll();
    return {
      data: divisions,
      message: 'Divisions retrieved successfully',
    };
  }

  

  @Get(':id')
  @ApiOperation({ summary: 'Ambil divisi berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil divisi' })
  @ApiResponse({ status: 404, description: 'Divisi tidak ditemukan' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseType<Division>> {
    const division = await this.service.findOne(id);
    return {
      data: division,
      message: 'Division retrieved successfully',
    };
  }

  @Post()
  @ApiOperation({ summary: 'Buat divisi baru' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: Division, description: 'Data divisi baru' })
  @ApiResponse({ status: 201, description: 'Divisi berhasil dibuat' })
  @UseInterceptors(AnyFilesInterceptor())
  async create(@Body() data: Partial<Division>): Promise<ApiResponseType<Division>> {
    const division = await this.service.create(data);
    return {
      data: division,
      message: 'Division created successfully',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update divisi berdasarkan ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: Division, description: 'Data divisi untuk patch' })
  @ApiResponse({ status: 200, description: 'Divisi berhasil diperbarui' })
  @ApiResponse({ status: 404, description: 'Divisi tidak ditemukan' })
  @UseInterceptors(AnyFilesInterceptor())
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Division>,
  ): Promise<ApiResponseType<Division>> {
    const updated = await this.service.update(id, data);
    return {
      data: updated,
      message: 'Division updated successfully',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus divisi berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Divisi berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Divisi tidak ditemukan' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseType<null>> {
    await this.service.delete(id);
    return {
      data: null,
      message: 'Division deleted successfully',
    };
  }
}
