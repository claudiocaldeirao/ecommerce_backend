import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { AuthAdapter } from './auth.adapter';
import { AuthTokenService } from './auth-token/auth-token.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authAdapter: AuthAdapter,
    private readonly jwtService: JwtService,
    private readonly authTokenService: AuthTokenService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserCredentialsDto> {
    const userCredentials =
      await this.authAdapter.getUserCredentialsByEmail(email);

    if (!userCredentials)
      throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(
      password,
      userCredentials.passwordHash,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return userCredentials;
  }

  async login(
    user: UserCredentialsDto,
  ): Promise<{ access_token: string; user_id: string }> {
    const payload = { sub: user.id, email: user.email, jti: uuidv4() };
    const token = this.jwtService.sign(payload);
    const decoded = this.jwtService.decode(token) as { exp: number };
    const expiresAt = new Date(decoded.exp * 1000);

    await this.authTokenService.saveToken(user.id, token, expiresAt);

    return {
      user_id: user.id,
      access_token: token,
    };
  }

  async register(data: RegisterDto): Promise<{ access_token: string }> {
    const userExists = await this.authAdapter.getUserCredentialsByEmail(
      data.email,
    );

    if (userExists) {
      throw new UnauthorizedException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(
      data.password,
      this.configService.get<string>('BCRYPT_SALT_ROUNDS'),
    );

    const newUser = await this.authAdapter.registerUser(
      data.name,
      data.email,
      passwordHash,
    );

    const payload = { sub: newUser.id, email: newUser.email, jti: uuidv4() };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
