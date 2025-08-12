import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogsService } from './activity_logs.service';
import { ActivityLogsController } from './activity_logs.controller';
import { ActivityLog } from './activity_log.entity'; // pastikan path sesuai

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog])], // ✅ Tambahkan ini
  providers: [ActivityLogsService],
  controllers: [ActivityLogsController],
  exports: [ActivityLogsService], // opsional
})
export class ActivityLogsModule {}
