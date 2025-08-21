import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Buat user baru' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Data user baru',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 201, description: 'User berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Data tidak valid' })
  @UseInterceptors(AnyFilesInterceptor())
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua user' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil data user' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil user berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'User ditemukan' })
  @ApiResponse({ status: 404, description: 'User tidak ditemukan' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'User berhasil diperbarui' })
  @ApiResponse({ status: 404, description: 'User tidak ditemukan' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus user berdasarkan ID' })
  @ApiResponse({ status: 200, description: 'User berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'User tidak ditemukan' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
