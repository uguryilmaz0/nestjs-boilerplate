import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import * as bcrypt from 'bcrypt';

// Bcrypt kütüphanesini taklit ediyoruz, böylece gerçek hashleme işlemi yapmadan testlerimizi yazabiliriz
// We are mocking the bcrypt library so we can write our tests without performing real hashing operations
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            // AuthService'de signAsync kullanılıyor, bu yüzden bunu taklit etmeliyiz
            // Since AuthService uses signAsync, we need to mock it
            signAsync: jest.fn().mockResolvedValue('mock_token'),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('secret') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // --- SIGNUP (KAYIT) TESTLERİ ---
  describe('signup', () => {
    const dto = { email: 'test@test.com', password: '123', name: 'Test User' };

    it('email zaten varsa ConflictException fırlatmalı / should throw ConflictException if email exists', async () => {
      // 1. ARRANGE: Prisma'nın P2002 (Unique) hatası fırlatmasını simüle ediyoruz
      // 1. ARRANGE: Simulating Prisma throwing a P2002 (Unique) error
      const prismaError = new PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '1.0.0',
      });

      jest.mocked(prisma.user.create).mockRejectedValue(prismaError);

      // 2. ACT & 3. ASSERT
      await expect(service.signup(dto)).rejects.toThrow(ConflictException);
    });

    it('başarılı kayıtta UserEntity dönmeli / should return UserEntity on success', async () => {
      // ARRANGE
      jest.mocked(prisma.user.create).mockResolvedValue({
        id: 1,
        ...dto,
        role: 'USER',
        deletedAt: null,
      } as any);

      // ACT
      const result = await service.signup(dto);

      // ASSERT
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.email).toBe(dto.email);
    });
  });

  // --- SIGNIN (GİRİŞ) TESTLERİ ---
  describe('signin', () => {
    const dto = { email: 'test@test.com', password: '123' };

    // Test: Kullanıcı bulunamazsa UnauthorizedException fırlatmalı / Test: should throw UnauthorizedException if user not found
    it('kullanıcı bulunamazsa UnauthorizedException fırlatmalı / should throw UnauthorizedException if user not found', async () => {
      // ARRANGE: findUnique null dönüyor
      jest.mocked(prisma.user.findUnique).mockResolvedValue(null);

      // ACT & ASSERT
      await expect(service.signin(dto)).rejects.toThrow(UnauthorizedException);
    });

    // Test: Şifre yanlışsa UnauthorizedException fırlatmalı / Test: should throw UnauthorizedException if password is incorrect
    it('şifre yanlışsa UnauthorizedException fırlatmalı / should throw UnauthorizedException if password is incorrect', async () => {
      // ARRANGE: Kullanıcı var ama bcrypt.compare FALSE dönecek
      // ARRANGE: User exists but bcrypt.compare will return FALSE
      jest.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 1,
        email: dto.email,
        password: 'hashed_password',
        deletedAt: null,
      } as any);

      // bcrypt.compare'un false döneceğini simüle ediyoruz
      // Simulating bcrypt.compare returning false
      jest.mocked(bcrypt.compare).mockResolvedValue(false as never);

      // ACT & ASSERT
      await expect(service.signin(dto)).rejects.toThrow(UnauthorizedException);
    });

    // Test: Kullanıcı silinmişse UnauthorizedException fırlatmalı / Test: should throw UnauthorizedException if user is soft-deleted
    it('kullanıcı silinmişse UnauthorizedException fırlatmalı / should throw UnauthorizedException if user is soft-deleted', async () => {
      // ARRANGE: Kullanıcı var ama deletedAt dolu (soft-delete edilmiş)
      // ARRANGE: User exists but deletedAt is set (soft-deleted)
      jest.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 1,
        deletedAt: new Date(), // Silinmiş kullanıcı / Soft-deleted user
      } as any);

      // ACT & ASSERT
      await expect(service.signin(dto)).rejects.toThrow(UnauthorizedException);
    })

    // Test: Bilgiler doğruysa AuthResponse dönmeli / Test: should return AuthResponse if credentials are correct
    it('bilgiler doğruysa AuthResponse dönmeli / should return AuthResponse if credentials are correct', async () => {
      // ARRANGE
      jest.mocked(prisma.user.findUnique).mockResolvedValue({
        id: 1,
        email: dto.email,
        password: 'hashed_password',
        role: 'USER',
        deletedAt: null,
      } as any);
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never);

      // ACT
      const result = await service.signin(dto);

      // ASSERT: Dönüş objesinin yapısını kontrol et
      // ASSERT: Check the structure of the returned object
      expect(result).toHaveProperty('access_token');
      expect(result.user).toBeInstanceOf(UserEntity);
    });
  });
});