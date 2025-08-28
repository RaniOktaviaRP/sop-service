import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login berhasil' })
  @ApiResponse({ status: 401, description: 'Email atau password salah' })
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const reqAny = req as any;

    const ipRaw =
      (req.headers['x-forwarded-for'] as string | string[]) ||
      reqAny.ip ||
      reqAny.connection?.remoteAddress ||
      reqAny.socket?.remoteAddress ||
      'unknown';

    const ip = Array.isArray(ipRaw) ? ipRaw[0] : ipRaw;

    return this.authService.login(dto, ip);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user baru' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Data tidak valid' })
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }
}
