import { IsBoolean } from 'class-validator';
import { ResourceOperationEnum } from '../types';

export class ResourceOperation implements Record<ResourceOperationEnum, boolean> {
  @IsBoolean()
  create: boolean;

  @IsBoolean()
  read: boolean;

  @IsBoolean()
  update: boolean;

  @IsBoolean()
  delete: boolean;
}
