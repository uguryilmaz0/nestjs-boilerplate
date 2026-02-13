import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { UserEntity } from './entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface AuthResponse {
  access_token: string;
  user: UserEntity;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }

  // Kullanıcı Kayıt Metodu / User Registration Method
  async signup(dto: AuthDto) {
    // 1. Şifreyi hash'le (güvenlik önceliği) / Hash the password (security first)
    const hash = await bcrypt.hash(dto.password, 10);

    try {
      // 2. Yeni kullanıcıyı veritabanına kaydet / Save new user to database
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hash,
        },
      });
      return new UserEntity(user);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // P2002: Unique constraint ihlali / Unique constraint violation
        if (error.code === 'P2002') {
          throw new ForbiddenException('Bu e-posta adresi zaten kullanılmaktadır. / This email is already in use.');
        }
      }
    }
  }

  // JWT Token Oluşturma Metodu / JWT Token Generation Method
  async signToken(userId: number, email: string): Promise<string> {
    const payload = { sub: userId, email };
    const secret = this.config.get<string>('JWT_SECRET');

    return this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    });
  }

  // Kullanıcı Giriş Metodu / User Login Method
  async signin(dto: LoginDto): Promise<AuthResponse> {
    // 1. Kullanıcıyı e-posta ile bul / Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // 2. Kullanıcı yoksa hata fırlat / Throw if user not found
    if (!user) {
      throw new ForbiddenException('Geçersiz kimlik bilgileri. / Invalid credentials.');
    }

    // 3. Şifreleri karşılaştır (plain text vs hashed) / Compare passwords
    const psMatch = await bcrypt.compare(dto.password, user.password);

    // 4. Şifre eşleşmiyorsa hata fırlat / Throw if password doesn't match
    if (!psMatch) {
      throw new ForbiddenException('Geçersiz kimlik bilgileri. / Invalid credentials.');
    }

    // 5. Entity dönüşümü ile şifre alanını otomatik gizle / Auto-hide password via Entity transform
    const token = await this.signToken(user.id, user.email);
    return {
      access_token: token,
      user: new UserEntity(user),
    };
  }
}
