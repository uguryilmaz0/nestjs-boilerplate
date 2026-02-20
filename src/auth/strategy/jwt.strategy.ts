import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      // 1. 'Authorization: Bearer <token>' başlığından token'ı çıkar
      //    Extract token from 'Authorization: Bearer <token>' header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 2. Token süresi dolmuşsa reddet / Reject expired tokens
      ignoreExpiration: false,
      // 3. İmza doğrulama için gizli anahtar / Secret key for signature verification
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  // Token geçerliyse çalışır, payload içeriğini döner
  // Runs when token is valid, returns payload content
  async validate(payload: { sub: number; email: string }) {
    // sub: Token içindeki userId / userId inside the token
    // Güvenlik için veritabanından tekrar kontrol / Re-verify from database for security
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    // Kullanıcı yoksa veya silinmişse reddet / Reject if user not found or deleted
    if (!user || user.deletedAt) {
      throw new UnauthorizedException(
        'Geçersiz token veya kullanıcı bulunamadı / Invalid token or user not found'
      );
    }

    // Kullanıcıyı döndür, bu bilgi request.user içinde erişilebilir olacak / Return user, this info will be accessible in request.user
    return new UserEntity(user);
  }
}
