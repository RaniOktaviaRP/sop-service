import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SopsModule } from './sops/sops.module';
import { SOPVersionsModule } from './sop_versions/sop_versions.module';
import { CategoriesModule } from './categories/categories.module';
import { DivisionsModule } from './divisions/divisions.module';
import { GroupMembersModule } from './group_members/group_members.module'; // ✅ Tambahkan ini
import { ApprovalWorkflowsModule } from './approval_workflows/approval_workflows.module'; // ✅ Tambahkan ini
import { AIResponseSourcesModule } from './ai_response_sources/ai_response_sources.module';
import { AIQueriesModule } from './ai_queries/ai_queries.module';
import { ActivityLogsModule } from './activity_logs/activity_logs.module';
import { SOPAssignmentsModule } from './sop_assignments/sop_assignments.module';
import { UserGroupsModule } from './user_groups/user_groups.module';
import { UsersModule } from './users/users.module';
import { SopFilesModule } from './sop_files/sop_files.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'rani2510',
      database: 'SOP',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    SopsModule,
    SOPVersionsModule,
    CategoriesModule,
    DivisionsModule,
    GroupMembersModule, 
    ApprovalWorkflowsModule,
    AIResponseSourcesModule,
    AIQueriesModule,
    ActivityLogsModule,
    SOPAssignmentsModule,
    UsersModule,
    UserGroupsModule,
    SopFilesModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
