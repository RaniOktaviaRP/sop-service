// sops.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SopsService } from './sops.service';
import { SopsController } from './sops.controller';
import { SOP } from './sop.entity';
import { SOPVersionsModule } from 'src/sop_versions/sop_versions.module';
import { SopFilesModule } from 'src/sop_files/sop_files.module'; // ✅ tambahkan ini

@Module({
  imports: [
    TypeOrmModule.forFeature([SOP]),
    SOPVersionsModule,
    SopFilesModule, 
  ],
  controllers: [SopsController],
  providers: [SopsService],
})
export class SopsModule {}
