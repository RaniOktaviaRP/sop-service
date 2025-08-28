import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SOPAssignmentsService } from './sop_assignments.service';
import { SOPAssignment } from './sop_assignment.entity';
import { SOPAssignmentsController } from './sop_assignments.controller';
import { SOP } from 'src/sops/sop.entity'; 
import { User } from 'src/users/user.entity'; 
import { UserGroup } from 'src/user_groups/user_group.entity'; 
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SOPAssignment, SOP, User, UserGroup]),
    MailModule,
  ],
  providers: [SOPAssignmentsService],
  controllers: [SOPAssignmentsController],
  exports: [SOPAssignmentsService],
})
export class SOPAssignmentsModule {}
