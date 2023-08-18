import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Permission } from 'src/modules/role/entities/permission.entity';
import { PERMISSION_GUARD_KEY } from '../constants';
import { PermissionGuardMetadata, JWTToken } from '../types';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const permission = this.reflector.get<PermissionGuardMetadata>(PERMISSION_GUARD_KEY, context.getHandler());

    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const admin = <JWTToken>request.user;

    const hasPermission = this.hasPermission(permission, admin.role.permission);

    if (!hasPermission) {
      throw new ForbiddenException({
        message: 'Forbidden',
        errors: { permission: 'You do not have permission to execute this operation on this resource' },
      });
    }

    return true;
  }

  private hasPermission({ resource, resourceOperation }: PermissionGuardMetadata, userPermission: Permission): boolean {
    return userPermission[resource]?.[resourceOperation];
  }
}
