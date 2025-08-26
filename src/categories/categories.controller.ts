import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  UseGuards,
  Delete,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

interface ApiResponseType<T> {
  data: T;
  message: string;
}

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) { }

  @Get()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin', 'Employee')
  @ApiOperation({ summary: 'Ambil semua kategori' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil daftar kategori' })
  async findAll(): Promise<ApiResponseType<Category[]>> {
    const categories = await this.service.findAll();
    return {
      data: categories,
      message: 'Categories retrieved successfully',
    };
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin', 'Employee')
  @ApiOperation({ summary: 'Ambil kategori berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil kategori' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseType<Category>> {
    const category = await this.service.findOne(id);
    return {
      data: category,
      message: 'Category retrieved successfully',
    };
  }

  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')

  @ApiOperation({ summary: 'Buat kategori baru' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: Category, description: 'Data kategori baru' })
  @ApiResponse({ status: 201, description: 'Kategori berhasil dibuat' })
  @UseInterceptors(AnyFilesInterceptor())
  async create(@Body() data: Partial<Category>): Promise<ApiResponseType<Category>> {
    const category = await this.service.create(data);
    return {
      data: category,
      message: 'Category created successfully',
    };
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')

  @ApiOperation({ summary: 'Update kategori berdasarkan ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: Category, description: 'Data kategori untuk update' })
  @ApiResponse({ status: 200, description: 'Kategori berhasil diperbarui' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan' })
  @UseInterceptors(AnyFilesInterceptor())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Category>,
  ): Promise<ApiResponseType<Category>> {
    const updated = await this.service.update(id, data);
    return {
      data: updated,
      message: 'Category updated successfully',
    };
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Roles('Admin')

  @ApiOperation({ summary: 'Hapus kategori berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'Kategori berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ApiResponseType<null>> {
    await this.service.delete(id);
    return {
      data: null,
      message: 'Category deleted successfully',
    };
  }
}
