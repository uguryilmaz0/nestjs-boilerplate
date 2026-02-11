import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from '../entity/user.entity';

interface RequestWithUser extends Request {
  user: UserEntity;
}

export const GetUser = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    // switchToHttp().getRequest'e yeni tipimizi (<RequestWithUser>) veriyoruz
    const r = ctx.switchToHttp().getRequest<RequestWithUser>();
    if (data) {
      return r.user[data]; // Sadece belirli bir alanı (örn: email) çekmek için
    }
    // Eğer @GetUser('email') gibi spesifik bir alan istendiyse onu dön, yoksa tüm user'ı dön
    return r.user;
  },
);
