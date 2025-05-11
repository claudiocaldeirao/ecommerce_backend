import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService } from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let mockHealthCheckService: Partial<HealthCheckService>;

  beforeEach(async () => {
    mockHealthCheckService = {
      check: jest.fn().mockResolvedValue({ status: 'ok' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health check result', async () => {
    const result = await controller.check();
    expect(result).toEqual({ status: 'ok' });
    expect(mockHealthCheckService.check).toHaveBeenCalledWith([]);
  });
});
