import { 
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  ParseIntPipe,
  UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GroupMembersService } from './group_members.service';
import { GroupMember } from './group_member.entity';

@Controller('group-members')
export class GroupMembersController {
  constructor(private readonly service: GroupMembersService) {}

  @Get()
  async findAll(): Promise<GroupMember[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GroupMember> {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([])) // ✅ Tidak ada file, tapi tetap bisa terima form-data
  async create(@Body() data: any): Promise<GroupMember> {
    const parsedData: Partial<GroupMember> = {
      ...data,
      group_id: data.group_id ? parseInt(data.group_id, 10) : undefined,
      user_id: data.user_id ? parseInt(data.user_id, 10) : undefined
    };

    return this.service.create(parsedData);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(id);
  }

  @Get('/group/:group_id')
  async findByGroup(@Param('group_id', ParseIntPipe) group_id: number): Promise<GroupMember[]> {
    return this.service.findByGroup(group_id);
  }

  @Get('/user/:user_id')
  async findByUser(@Param('user_id', ParseIntPipe) user_id: number): Promise<GroupMember[]> {
    return this.service.findByUser(user_id);
  }
}
