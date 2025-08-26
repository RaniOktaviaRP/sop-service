import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SopsModule } from './sops/sops.module';
import { SOPVersionsModule } from './sop_versions/sop_versions.module';
import { CategoriesModule } from './categories/categories.module';
import { DivisionsModule } from './divisions/divisions.module';
import { GroupMembersModule } from './group_members/group_members.module';
import { ApprovalWorkflowsModule } from './approval_workflows/approval_workflows.module';
import { AIResponseSourcesModule } from './ai_response_sources/ai_response_sources.module';
import { AIQueriesModule } from './ai_queries/ai_queries.module';
import { ActivityLogsModule } from './activity_logs/activity_logs.module';
import { SOPAssignmentsModule } from './sop_assignments/sop_assignments.module';
import { UsersModule } from './users/users.module';
import { UserGroupsModule } from './user_groups/user_groups.module';
import { SopFilesModule } from './sop_files/sop_files.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
