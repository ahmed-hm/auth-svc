import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_GUARD_KEY } from '../constants';

export const IsPublic = (): MethodDecorator => SetMetadata(IS_PUBLIC_GUARD_KEY, true);
