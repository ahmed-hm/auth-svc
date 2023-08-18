import { IsObject, ValidateNested } from 'class-validator';
import { ResourceEnum } from '../types/resource.enum';
import { ResourceOperation } from './resource-operation.entity';

export class Permission implements Record<ResourceEnum, ResourceOperation> {
  @IsObject()
  @ValidateNested()
  user: ResourceOperation;

  @IsObject()
  @ValidateNested()
  role: ResourceOperation;
}
