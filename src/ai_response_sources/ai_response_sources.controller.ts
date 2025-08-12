import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AIResponseSourcesService } from './ai_response_sources.service';
import { CreateAIResponseSourceDto } from './dto/create-ai_response_source.dto';

@Controller('ai-response-sources')
export class AIResponseSourcesController {
  constructor(private readonly service: AIResponseSourcesService) {}

  @Post()
  async create(@Body() dto: CreateAIResponseSourceDto) {
    return this.service.create(dto);
  }

  @Get()
  async findByQuery(@Query('query_id') queryId: number) {
    return this.service.findByQueryId(queryId);
  }
}
