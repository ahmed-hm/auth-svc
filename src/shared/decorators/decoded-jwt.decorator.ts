import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const DecodedJWT = createParamDecorator(createParamDecoratorCallback);

export function createParamDecoratorCallback(data: unknown, ctx: ExecutionContext) {
  const request = ctx.switchToHttp().getRequest<Request>();

  return request.user;
}
