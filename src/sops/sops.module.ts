import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SopsService } from './sops.service';
import { SopsController } from './sops.controller';
import { SOP } from './sop.entity';
import { SOPVersionsModule } from 'src/sop_versions/sop_versions.module';
import { SopFilesModule } from 'src/sop_files/sop_files.module'; 
import { AuthModule } from 'src/auth/auth.module';
import { SOPAssignment } from 'src/sop_assignments/sop_assignment.entity';
import { User } from 'src/users/user.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SOP, SOPAssignment, User]),
    SOPVersionsModule,
    SopFilesModule, 
    AuthModule, 
    MailModule,
  ],
  controllers: [SopsController],
  providers: [SopsService],
})
export class SopsModule {}
