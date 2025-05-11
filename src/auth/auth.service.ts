import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(
      password,
      user.hashed_password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: RegisterDto): Promise<{ access_token: string }> {
    const userExists = await this.usersService.findByEmail(data.email);

    if (userExists) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.usersService.create(
      data.name,
      data.email,
      hashedPassword,
    );

    const payload = { sub: newUser.id, email: newUser.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
