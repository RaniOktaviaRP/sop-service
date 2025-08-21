import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SOPVersionsService } from './sop_versions.service';
import { SOPVersionsController } from './sop_versions.controller';
import { SOPVersion } from './sop_version.entity';
import { SOP } from 'src/sops/sop.entity';
import { SOPFile } from 'src/sop_files/sop_file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SOPVersion, SOP, SOPFile])],
  providers: [SOPVersionsService],
  controllers: [SOPVersionsController],
  exports: [SOPVersionsService], 
})
export class SOPVersionsModule {}
