import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles-decorator';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true; // Eğer rota üzerinde rol tanımlanmamışsa, erişime izin ver

        const { user } = context.switchToHttp().getRequest();

        return requiredRoles.includes(user.role); // Kullanıcının rolü, gerekli roller arasında mı?
    }
}
