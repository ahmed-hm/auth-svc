import { PickType } from '@nestjs/swagger';
import { Role } from './role.entity';

export class SubRole extends PickType(Role, ['_id', 'type']) {}
