import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { JwtConfig } from '../config/jwt.config';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthAdapter } from './auth.adapter';
import { AuthTokenService } from './auth-token.service';
import { AuthToken } from './entity/auth-token.entity';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UserModule,
    TypeOrmModule.forFeature([AuthToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: JwtConfig,
    }),
  ],
  providers: [JwtStrategy, AuthService, AuthAdapter, AuthTokenService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
