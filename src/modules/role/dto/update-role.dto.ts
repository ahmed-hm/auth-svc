import { PickType } from '@nestjs/swagger';
import { Role } from '../entities/role.entity';

export class UpdateRoleDto extends PickType(Role, ['permission']) {}
