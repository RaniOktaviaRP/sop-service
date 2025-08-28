import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/users/user.entity';
import { LoginDto } from './dto/login.dto';
import { Division } from 'src/divisions/division.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ActivityLogsService } from 'src/activity_logs/activity_logs.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,

    @InjectRepository(Division)
    private divisionsRepo: Repository<Division>,

    private jwtService: JwtService,

    private activityLogsService: ActivityLogsService,
  ) { }

  /** Validasi login user */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { email },
      relations: ['division'],
    });

    if (!user) throw new UnauthorizedException('Email tidak ditemukan');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Password salah');

    return user;
  }

  /** Login */
  async login(dto: LoginDto, ip?: string) {
    const user = await this.validateUser(dto.email, dto.password);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      division_id: user.division?.id || null,
      division_name: user.division?.division_name || null,
    };

    await this.activityLogsService.createLog({
      user_id: user.id,
      activity_type: 'Login',
      activity_description: `${user.username} berhasil login`,
      ip_address: ip, 
    });

    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        username: user.username,
        role: user.role,
        division_id: user.division?.id || null,
        division_name: user.division?.division_name || null,
      },
    };
  }

  /** Register user baru */
  async register(dto: CreateUserDto) {
    // cek email
    const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email sudah digunakan');

    // hash password
    const hash = await bcrypt.hash(dto.password_hash, 10);

    // cari division
    let division: Division | undefined;
    if (dto.division_name) {
      const found = await this.divisionsRepo.findOne({ where: { division_name: dto.division_name } });
      if (!found) throw new BadRequestException('Division tidak ditemukan');
      division = found;
    }

    // buat user baru
    const user: DeepPartial<User> = {
      full_name: dto.full_name,
      username: dto.username,
      email: dto.email,
      password_hash: hash,
      role: UserRole.Employee, // default Employee
      division: division,
    };

    const savedUser = await this.usersRepo.save(user);

    return {
      message: 'User berhasil diregistrasi',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        full_name: savedUser.full_name,
        username: savedUser.username,
        role: savedUser.role,
        division_id: savedUser.division?.id || null,
        division_name: savedUser.division?.division_name || null,
      },
    };
  }
}
