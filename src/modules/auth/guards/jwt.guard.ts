import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_GUARD_KEY } from '../constants';

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext): TUser {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_GUARD_KEY, context.getHandler());

    if (!isPublic && (err || !user)) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        errors: { token: 'Invalid token' },
      });
    }

    return user ?? true;
  }
}
