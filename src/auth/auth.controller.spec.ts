import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entity/user.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          // Mocking the AuthService methods / AuthService'nin metodlarını taklit etme
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            signin: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- SIGNUP (KAYIT) TESTLERİ ---
  describe('signup', () => {
    const dto: AuthDto = {
      email: 'me@test.com',
      password: '123',
      name: 'Test User',
    }
    const expectedUser = new UserEntity({
      id: 1,
      ...dto,
    });

    // Email zaten varsa ConflictException fırlatmalı / should throw ConflictException if email exists
    it('email zaten varsa ConflictException fırlatmalı / should throw ConflictException if email exists', async () => {
      // ARRANGE: Servis ConflictException fırlatsın
      jest.spyOn(service, 'signup').mockRejectedValue(new ConflictException('Email already exists / Email zaten kullanılmaktadır '));

      // ACT & ASSERT: Controller metodunu çağırırken hata fırlatılmalı
      await expect(controller.signup(dto)).rejects.toThrow(ConflictException);

      // Ayrıca servis doğru çağrıldı mı kontrol edelim / Also check if the service was called correctly
      expect(service.signup).toHaveBeenCalledWith(dto);
    });

    // Başarılı kayıtta kullanıcı dönmeli / should return user on successful registration
    it('servis üzerinden kullanıcıyı kaydetmeli / should register user via service', async () => {
      // ARRANGE: Servisin ne döneceğini ayarlıyoruz
      // ARRANGE: Setting what the service will return
      jest.spyOn(service, 'signup').mockResolvedValue(expectedUser);

      // ACT: Controller metodunu çağırıyoruz
      // ACT: Calling the controller method
      const result = await controller.signup(dto);

      // ASSERT: Servis doğru çağrıldı mı ve sonuç doğru mu?
      // ASSERT: Was the service called correctly and is the result correct?
      expect(service.signup).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedUser);
    });
  });

  // --- SIGNIN (GİRİŞ) TESTLERİ ---
  describe('signin', () => {
    const dto: LoginDto = {
      email: 'me@test.com',
      password: '123',
    }
    const expectedResponse = {
      access_token: 'mock_token',
      user: new UserEntity({
        id: 1,
        email: dto.email,
      })
    }

    // Başarısız girişte UnauthorizedException fırlatmalı / should throw UnauthorizedException on failed sign in
    it('servis hata fırlatırsa UnauthorizedException fırlatmalı / should throw UnauthorizedException if service fails', async () => {
      // ARRANGE: Servis hata fırlatsın
      // mockRejectedValue asenkron hatalar için kullanılır
      jest.spyOn(service, 'signin').mockRejectedValue(new UnauthorizedException('Geçersiz kimlik bilgileri / Invalid credentials'));

      // ACT & ASSERT / Hazırlık & Doğrulama: Controller metodunu çağırırken hata fırlatılmalı 
      // ACT & ASSERT: Should throw an error when calling the controller method
      await expect(controller.signin(dto)).rejects.toThrow(UnauthorizedException);

      // Ayrıca servis doğru çağrıldı mı kontrol edelim / Also check if the service was called correctly
      expect(service.signin).toHaveBeenCalledWith(dto);
    })

    // Başarılı girişte token ve kullanıcı dönmeli / should return token & user on successful sign in
    it('giriş yapıp token ve kullanıcı dönmeli / should sign in and return token & user', async () => {

      // ARRANGE / Hazırlık : Servisin ne döneceğini ayarlıyoruz
      // ARRANGE: Setting what the service will return
      jest.spyOn(service, 'signin').mockResolvedValue(expectedResponse);

      // ACT / Aksiyon: Controller metodunu çağırıyoruz
      // ACT: Calling the controller method
      const result = await controller.signin(dto);

      // ASSERT / Doğrulama: Servis doğru çağrıldı mı ve sonuç doğru mu?
      // ASSERT: Was the service called correctly and is the result correct?
      expect(service.signin).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    })
  });
});