import { 
  Controller, Get, Param, Post, Body, Delete, ParseIntPipe, UseInterceptors 
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { SOPAssignmentsService } from './sop_assignments.service';
import { SOPAssignment } from './sop_assignment.entity';

@Controller('sop-assignments')
export class SOPAssignmentsController {
  constructor(private readonly service: SOPAssignmentsService) {}

  @Get()
  async findAll(): Promise<SOPAssignment[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SOPAssignment> {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor()) // supaya bisa parse form-data
  async create(@Body() data: Partial<SOPAssignment>): Promise<SOPAssignment> {
    return this.service.create(data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(id);
  }
}
