import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { Tokens } from 'types';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const isExisingEmail = await this.prisma.user.findFirst({
      where: {
        email: registerDto.email,
      },
    });

    if (isExisingEmail) {
      throw new HttpException('Email has been used', 400);
    }

    const passwordHash = await hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...registerDto,
        password: passwordHash,
      },
    });

    return user;
  }

  async login(data: LoginDto): Promise<Tokens> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      throw new HttpException('Email not found', 404);
    }

    const verify = await compare(data.password, user.password);

    if (!verify) {
      throw new HttpException("Password doesn't correct", 401);
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshToken(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user || !refreshToken) {
      throw new UnauthorizedException();
    }

    const matchRt = await compare(refreshToken, user.refresh_token);

    if (!matchRt) {
      throw new HttpException('Invalid token', 400);
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRtHash(userId: number, refreshToken: string): Promise<void> {
    const hashedRt = await hash(refreshToken, 10);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: hashedRt,
      },
    });
  }

  async generateTokens(id: number, email: string): Promise<Tokens> {
    const payload = {
      id,
      email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('AT_SECRET'),
      expiresIn: this.config.get<string>('EXP_ACCESS'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('RT_SECRET'),
      expiresIn: this.config.get<string>('EXP_REFRESH'),
    });

    return { accessToken, refreshToken };
  }
}
