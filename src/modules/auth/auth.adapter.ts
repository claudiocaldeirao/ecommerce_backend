import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';

@Injectable()
export class AuthAdapter {
  constructor(private readonly userService: UserService) {}

  async getUserCredentialsByEmail(
    email: string,
  ): Promise<UserCredentialsDto | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    return new UserCredentialsDto(user.id, user.email, user.passwordHash);
  }

  async registerUser(
    email: string,
    name: string,
    passwordHash: string,
  ): Promise<UserCredentialsDto> {
    const user = await this.userService.create(email, name, passwordHash);
    return new UserCredentialsDto(user.id, user.email, user.passwordHash);
  }
}
