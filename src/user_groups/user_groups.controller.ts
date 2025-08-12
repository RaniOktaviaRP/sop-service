import { 
  Controller, Get, Param, Post, Body, Put, Delete, ParseIntPipe, UseInterceptors 
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UserGroupsService } from './user_groups.service';
import { UserGroup } from './user_group.entity';

@Controller('user-groups')
export class UserGroupsController {
  constructor(private readonly service: UserGroupsService) {}

  @Get()
  async findAll(): Promise<UserGroup[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserGroup> {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor()) // ini supaya NestJS bisa parsing form-data
  async create(@Body() data: Partial<UserGroup>): Promise<UserGroup> {
    return this.service.create(data);
  }

  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor()) // untuk update lewat form-data
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<UserGroup>,
  ): Promise<UserGroup> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(id);
  }
}
