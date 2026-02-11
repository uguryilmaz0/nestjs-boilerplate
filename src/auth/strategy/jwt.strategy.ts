import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      // 1. İstekteki 'Authorization: Bearer <token>' kısmını bul ve token'ı çek
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Token'ın süresinin dolup dolmadığını kontrol et
      ignoreExpiration: false,
      // 3. İmzayı kontrol etmek için senin gizli anahtarını kullan
      secretOrKey: config.get<string>('JWT_SECRET') || '-',
    });
  }

  // Token geçerliyse bu metod çalışır ve payload (ID, email) içeriğini alır
  async validate(payload: { sub: number; email: string }) {
    // sub: Token içindeki userId'dir
    // Veritabanından kullanıcıyı tekrar kontrol ediyoruz (Güvenlik için)
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    return new UserEntity(user);
  }
}
