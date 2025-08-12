import { Controller, Post, Get, Body, Param, Patch, Query } from '@nestjs/common';
import { AIQueriesService } from './ai_queries.service';
import { CreateAIQueryDto } from './dto/create-ai_query.dto';

@Controller('ai-queries')
export class AIQueriesController {
  constructor(private readonly aiQueriesService: AIQueriesService) {}

  @Post()
  async create(@Body() dto: CreateAIQueryDto) {
    return this.aiQueriesService.create(dto);
  }

  @Get()
  async findAll() {
    return this.aiQueriesService.findAll();
  }

  @Get('by-user')
  async findByUser(@Query('user_id') userId: number) {
    return this.aiQueriesService.findByUserId(userId);
  }

  @Patch(':id/feedback')
  async giveFeedback(@Param('id') id: number, @Body() body: { feedback: string }) {
    return this.aiQueriesService.addFeedback(id, body.feedback);
  }
}
