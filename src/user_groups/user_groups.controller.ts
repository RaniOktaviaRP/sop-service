import { 
  Controller, Get, Param, Post, Body, Patch, Delete, ParseIntPipe, 
  UseInterceptors 
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UserGroupsService } from './user_groups.service';
import { UserGroup } from './user_group.entity';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiConsumes 
} from '@nestjs/swagger';

@ApiTags('User Groups')
@Controller('user-groups')
export class UserGroupsController {
  constructor(private readonly service: UserGroupsService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil semua group user' })
  @ApiResponse({ status: 200, description: 'Daftar semua group user', type: [UserGroup] })
  async findAll(): Promise<UserGroup[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil group user berdasarkan ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Detail group user', type: UserGroup })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserGroup> {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Tambah group user baru (via form-data)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
      group_name: { type: 'string', example: 'RPL Team' },
        description: { type: 'string', example: 'Group untuk tim RPL' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Group user berhasil dibuat', type: UserGroup })
  async create(@Body() data: Partial<UserGroup>): Promise<UserGroup> {
    return this.service.create(data);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update group user (via form-data)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        group_name: { type: 'string', example: 'RPL Team Baru' },
        description: { type: 'string', example: 'Group untuk project RPL Semester 5' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Group user berhasil diperbarui', type: UserGroup })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<UserGroup>,
  ): Promise<UserGroup> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus group user berdasarkan ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Group user berhasil dihapus' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(id);
  }
}
