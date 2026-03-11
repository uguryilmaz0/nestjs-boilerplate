import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          // ConfigService'i gerçek haliyle değil, bir taklit (mock) olarak veriyoruz
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock_db_url'), // get() çağrıldığında bu değeri dönecek
          },
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});