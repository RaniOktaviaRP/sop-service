import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './activity_log.entity';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepo: Repository<ActivityLog>,
  ) {}

  async createLog(data: Partial<ActivityLog>) {
    const log = this.activityLogRepo.create(data);
    return this.activityLogRepo.save(log);
  }
}
