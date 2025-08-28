import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Division } from 'src/divisions/division.entity'; 
import { ActivityLogsModule } from 'src/activity_logs/activity_logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Division]),
    ActivityLogsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // ambil dari .env
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, JwtStrategy],
})
export class AuthModule {}
