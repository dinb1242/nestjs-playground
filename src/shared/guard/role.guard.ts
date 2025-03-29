import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enum/role.enum';
import { ROLES_KEY } from '../decorator/auth.decorator';
import { CustomRequest } from '../interface/custom-request.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user }: CustomRequest = context.switchToHttp().getRequest();

    const isAuthenticated = requiredRoles.includes(user.role);

    if (!isAuthenticated) {
      throw new ForbiddenException(
        `권한이 없습니다. 요청=${user.role}, 필요=${requiredRoles.toString()}`,
      );
    }

    return true;
  }
}
