import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

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
import { MailService } from './mail/mail.service';

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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          secure: false, // true kalau pakai 465
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: config.get<string>('MAIL_FROM'),
        },
        template: {
           dir: join(process.cwd(), 'src', 'templates'), // ⬅️ karena assignment.hbs ada di src/mail
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
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
  providers: [AppService, MailService],
})
export class AppModule {}
