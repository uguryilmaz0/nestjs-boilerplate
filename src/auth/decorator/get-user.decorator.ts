import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from '../entity/user.entity';

interface RequestWithUser extends Request {
  user: UserEntity;
}

export const GetUser = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    // HTTP isteğinden kullanıcı nesnesini çıkarır
    // Extracts user object from the HTTP request
    const r = ctx.switchToHttp().getRequest<RequestWithUser>();
    if (data) {
      return r.user[data]; // Belirli bir alan döner (örn: email) / Returns specific field (e.g., email)
    }
    // Tüm user nesnesini döner / Returns the full user object
    return r.user;
  },
);
