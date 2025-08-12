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
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.service.findOne(id);
  }

  @Post()
  @UseInterceptors(AnyFilesInterceptor()) // Bisa terima form-data
  async create(@Body() data: Partial<Category>): Promise<Category> {
    return this.service.create(data);
  }

  @Put(':id')
  @UseInterceptors(AnyFilesInterceptor()) // Update juga bisa form-data
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Category>,
  ): Promise<Category> {
    return this.service.update(id, data);
  }

  @Patch(':id')
  @UseInterceptors(AnyFilesInterceptor()) // Patch juga bisa form-data
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Category>,
  ): Promise<Category> {
    return this.service.update(id, data); // Bisa pakai method update juga
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(id);
  }
}
