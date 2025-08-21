import { 
  Controller, Get, Param, Post, Body, Delete, Patch, ParseIntPipe, 
  UseInterceptors, BadRequestException 
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GroupMembersService } from './group_members.service';
import { GroupMember } from './group_member.entity';
import { UserGroupsService } from 'src/user_groups/user_groups.service';
import { UsersService } from 'src/users/users.service';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiConsumes 
} from '@nestjs/swagger';

@ApiTags('Group Members')
@Controller('group-members')
export class GroupMembersController {
  constructor(
    private readonly service: GroupMembersService,
    private readonly groupsService: UserGroupsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Tambah anggota group baru (via form-data, hanya group_name & user_name)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        group_name: { type: 'string', example: 'RPL Team' },
        user_name: { type: 'string', example: 'Rani Oktavia' },
      },
      required: ['group_name', 'user_name'],
    },
  })
  async create(@Body() data: any): Promise<GroupMember> {
    const group = await this.groupsService.findByName(data.group_name);
    if (!group) throw new BadRequestException(`Group '${data.group_name}' tidak ditemukan`);

    const user = await this.usersService.findByName(data.user_name);
    if (!user) throw new BadRequestException(`User '${data.user_name}' tidak ditemukan`);

    return this.service.create({
      group_id: group.id,
      user_id: user.id,
    });
  }

  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update anggota group (via form-data, hanya group_name & user_name)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        group_name: { type: 'string', example: 'RPL Team Baru' },
        user_name: { type: 'string', example: 'Budi Setiawan' },
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ): Promise<GroupMember> {
    const existing = await this.service.findOne(id);

    let groupId = existing.group_id;
    let userId = existing.user_id;

    if (data.group_name) {
      const group = await this.groupsService.findByName(data.group_name);
      if (!group) throw new BadRequestException(`Group '${data.group_name}' tidak ditemukan`);
      groupId = group.id;
    }

    if (data.user_name) {
      const user = await this.usersService.findByName(data.user_name);
      if (!user) throw new BadRequestException(`User '${data.user_name}' tidak ditemukan`);
      userId = user.id;
    }

    return this.service.update(id, {
      group_id: groupId,
      user_id: userId,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus anggota group' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(id);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua anggota group' })
  async findAll() {
    return this.service.findAll();
  }

  @Get('/group/:group_id')
  @ApiOperation({ summary: 'Ambil anggota berdasarkan group_id' })
  async findByGroup(@Param('group_id', ParseIntPipe) group_id: number): Promise<GroupMember[]> {
    return this.service.findByGroup(group_id);
  }

  @Get('/user/:user_id')
  @ApiOperation({ summary: 'Ambil group berdasarkan user_id' })
  async findByUser(@Param('user_id', ParseIntPipe) user_id: number): Promise<GroupMember[]> {
    return this.service.findByUser(user_id);
  }
}
