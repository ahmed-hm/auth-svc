import { IsObject, IsString, ValidateNested } from 'class-validator';
import { BaseEntity } from 'src/shared/entities';
import { Permission } from './permission.entity';

export class Role extends BaseEntity {
  @IsString()
  type: string;

  @IsObject()
  @ValidateNested()
  permission: Permission;
}
