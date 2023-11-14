import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      const matchRole = roles.includes(request.user.role);

      if (!matchRole) {
        throw new ForbiddenException('Use only for the HOST role.');
      }

      return true;
    }

    throw new ForbiddenException('Use only for the HOST role.');
  }
}
