import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { AuthAdapter } from './auth.adapter';
import { AuthTokenService } from './auth-token/auth-token.service';

describe('AuthService', () => {
  let service: AuthService;
  let authAdapter: jest.Mocked<AuthAdapter>;
  let jwtService: jest.Mocked<JwtService>;
  let authTokenService: jest.Mocked<AuthTokenService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUserCredentials = {
    id: 'user-id-123',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthAdapter,
          useValue: {
            getUserCredentialsByEmail: jest.fn(),
            registerUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: AuthTokenService,
          useValue: {
            saveToken: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authAdapter = module.get(AuthAdapter);
    jwtService = module.get(JwtService);
    authTokenService = module.get(AuthTokenService);
    configService = module.get(ConfigService);
  });

  describe('validateUser', () => {
    it('should return user credentials if email and password match', async () => {
      authAdapter.getUserCredentialsByEmail.mockResolvedValue(
        mockUserCredentials,
      );
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(authAdapter.getUserCredentialsByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password',
        mockUserCredentials.passwordHash,
      );
      expect(result).toEqual(mockUserCredentials);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      authAdapter.getUserCredentialsByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser('wrong@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(authAdapter.getUserCredentialsByEmail).toHaveBeenCalledWith(
        'wrong@example.com',
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      authAdapter.getUserCredentialsByEmail.mockResolvedValue(
        mockUserCredentials,
      );
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        mockUserCredentials.passwordHash,
      );
    });
  });

  describe('login', () => {
    it('should generate token, save it and return access_token with user_id', async () => {
      const user = mockUserCredentials;
      const fakeToken = 'fake.jwt.token';
      const fakeExp = Math.floor(Date.now() / 1000) + 3600;

      jwtService.sign.mockReturnValue(fakeToken);
      jwtService.decode.mockReturnValue({ exp: fakeExp });
      authTokenService.saveToken.mockResolvedValue(undefined);

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        jti: expect.any(String),
      });
      expect(jwtService.decode).toHaveBeenCalledWith(fakeToken);
      expect(authTokenService.saveToken).toHaveBeenCalledWith(
        user.id,
        fakeToken,
        new Date(fakeExp * 1000),
      );
      expect(result).toEqual({ user_id: user.id, access_token: fakeToken });
    });
  });

  describe('register', () => {
    const registerDto = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'newpassword',
    };

    it('should throw UnauthorizedException if email already exists', async () => {
      authAdapter.getUserCredentialsByEmail.mockResolvedValue(
        mockUserCredentials,
      );

      await expect(service.register(registerDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authAdapter.getUserCredentialsByEmail).toHaveBeenCalledWith(
        registerDto.email,
      );
    });

    it('should hash password, register user and return access_token', async () => {
      authAdapter.getUserCredentialsByEmail.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedNewPassword');
      configService.get.mockReturnValue(10);
      const newUser = {
        id: 'new-id',
        email: registerDto.email,
        passwordHash: 'hashedNewPassword',
      };
      authAdapter.registerUser.mockResolvedValue(newUser);
      const fakeToken = 'new.jwt.token';
      jwtService.sign.mockReturnValue(fakeToken);

      const result = await service.register(registerDto);

      expect(configService.get).toHaveBeenCalledWith('BCRYPT_SALT_ROUNDS');
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(authAdapter.registerUser).toHaveBeenCalledWith(
        registerDto.name,
        registerDto.email,
        'hashedNewPassword',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: newUser.id,
        email: newUser.email,
        jti: expect.any(String),
      });
      expect(result).toEqual({ access_token: fakeToken });
    });
  });
});
