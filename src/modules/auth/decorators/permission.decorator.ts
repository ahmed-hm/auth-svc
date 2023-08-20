import { SetMetadata } from '@nestjs/common';
import { PERMISSION_GUARD_KEY } from '../constants';
import { PermissionGuardMetadata } from '../types';

export const Permission = (permission: PermissionGuardMetadata) => SetMetadata(PERMISSION_GUARD_KEY, permission);
