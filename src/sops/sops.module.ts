import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SopsService } from './sops.service';
import { SopsController } from './sops.controller';
import { SOP } from './sop.entity';
import { SOPVersionsModule } from 'src/sop_versions/sop_versions.module';
import { SopFilesModule } from 'src/sop_files/sop_files.module'; 
import { AuthModule } from 'src/auth/auth.module';
import { SOPAssignment } from 'src/sop_assignments/sop_assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SOP, SOPAssignment ]),
    SOPVersionsModule,
    SopFilesModule, 
    AuthModule, 
  ],
  controllers: [SopsController],
  providers: [SopsService],
})
export class SopsModule {}
