import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthToken } from './entity/auth-token.entity';

@Injectable()
export class AuthTokenService {
  constructor(
    @InjectRepository(AuthToken)
    private readonly repo: Repository<AuthToken>,
  ) {}

  async saveToken(email: string, token: string, expiresAt: Date) {
    const authToken = this.repo.create({ email, token, expiresAt });
    return this.repo.save(authToken);
  }

  async isRevoked(token: string): Promise<boolean> {
    const record = await this.repo.findOne({ where: { token } });
    return !record || record.revoked || record.expiresAt < new Date();
  }

  async revokeToken(token: string) {
    await this.repo.update({ token }, { revoked: true });
  }
}
