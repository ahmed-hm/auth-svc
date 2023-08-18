import { IsDate, IsInstance, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { TransformObjectId } from '../decorators';

export class BaseEntity<T = any> {
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  @IsInstance(Types.ObjectId)
  @TransformObjectId()
  _id: Types.ObjectId;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsDate()
  @IsOptional()
  updatedAt: Date;
}
