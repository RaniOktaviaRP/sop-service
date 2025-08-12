import { 
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Patch,
  Delete,
  ParseIntPipe,
  UseInterceptors
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { DivisionsService } from './divisions.service';
import { Division } from './division.entity';

@Controller('divisions')
export class DivisionsController {
  constructor(private readonly service: DivisionsService) {}

  @Get()
  async findAll(): Promise<Division[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Division> {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor()) // form-data bisa diparse
  async create(@Body() data: Partial<Division>): Promise<Division> {
    return this.service.create(data);
  }

  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor()) // update juga bisa lewat form-data
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Division>,
  ): Promise<Division> {
    return this.service.update(id, data);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor()) // patch juga form-data
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Division>,
  ): Promise<Division> {
    return this.service.update(id, data); // bisa pakai method update juga
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(id);
  }
}
