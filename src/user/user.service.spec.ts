import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

const mockUser = {
  id: '123456789',
  name: 'John Doe',
  email: 'john@example.com',
  passwordHash: 'hashed123',
  createdAt: new Date(),
  updatedAt: new Date(),
} as User;

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(User));
  });

  describe('findByEmail', () => {
    it('should return a user if found by email', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('john@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user is found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'notfound@example.com' },
      });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const createDto = {
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: 'hashed123',
      };
      repository.create.mockReturnValue(mockUser);
      repository.save.mockResolvedValue(mockUser);

      const result = await service.create(
        createDto.name,
        createDto.email,
        createDto.passwordHash,
      );

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      repository.find.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });
});
