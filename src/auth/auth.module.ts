import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AtStrategy } from './stragegies/at.stragegy';
import { RtStrategy } from './stragegies/rt.stragegy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService, AtStrategy, RtStrategy],
})
export class AuthModule {}
