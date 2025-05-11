import { ConfigService } from '@nestjs/config';

export const JwtConfig = async (configService: ConfigService) => ({
  secret: configService.get<string>('JWT_SECRET'),
  signOptions: {
    expiresIn: configService.get<string>('JWT_EXPIRATION_TIME', '1h'),
  },
});
