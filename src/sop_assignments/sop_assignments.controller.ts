import { 
  Controller, Get, Param, Post, Body, Delete, ParseIntPipe, UseInterceptors 
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { SOPAssignmentsService } from './sop_assignments.service';
import { SOPAssignment } from './sop_assignment.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CreateSOPAssignmentDto } from './dto/create-sop_assignment.dto';

@ApiTags('SOP Assignments')
@Controller('sop-assignments')
export class SOPAssignmentsController {
  constructor(private readonly service: SOPAssignmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all SOP assignments' })
  @ApiResponse({ status: 200, description: 'List of SOP assignments', type: [SOPAssignment] })
  async findAll(): Promise<SOPAssignment[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one SOP assignment by ID' })
  @ApiResponse({ status: 200, description: 'SOP assignment found', type: SOPAssignment })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SOPAssignment> {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({ summary: 'Create new SOP assignment' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        groupName: { type: 'string', example: 'Team QA' },
        userName: { type: 'string', example: 'Rani Oktavia' },
        sopId: { type: 'number', example: 1 }
      },
      required: ['groupName', 'userName', 'sopId'],
    },
  })
  @ApiResponse({ status: 201, description: 'SOP assignment created', type: SOPAssignment })
  async create(@Body() data: CreateSOPAssignmentDto): Promise<SOPAssignment> {
  return this.service.create(data);
}

  @Delete(':id')
  @ApiOperation({ summary: 'Delete SOP assignment by ID' })
  @ApiResponse({ status: 200, description: 'SOP assignment deleted' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
  return this.service.remove(id); 
}
}
