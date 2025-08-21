import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SopFilesService } from './sop_files.service';
import { SopFilesController } from './sop_files.controller';
import { SOPFile } from './sop_file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SOPFile])],
  controllers: [SopFilesController],
  providers: [SopFilesService],
  exports: [SopFilesService],
})
export class SopFilesModule {}
