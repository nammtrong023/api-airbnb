import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorator/roles.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      const user = await this.userService.getUser(request.user.id);

      const matchRole = roles.includes(user.role);

      if (!matchRole) {
        throw new ForbiddenException('Use only for the HOST role.');
      }

      return true;
    }

    throw new ForbiddenException('Use only for the HOST role.');
  }
}
