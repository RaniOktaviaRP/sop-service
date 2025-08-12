import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SOPVersionsController } from './sop_versions.controller';
import { SOPVersionsService } from './sop_versions.service';
import { SOPVersion } from './sop_version.entity';
import { SOP } from 'src/sops/sop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SOPVersion, SOP]) // ✅ daftarkan kedua entity di sini
  ],
  controllers: [SOPVersionsController],
  providers: [SOPVersionsService],
  exports: [SOPVersionsService],
})
export class SOPVersionsModule {}
