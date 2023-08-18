import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { TransformObjectId } from '../decorators';

export class IdDto {
  @ApiProperty({ type: String, format: 'ObjectId' })
  @TransformObjectId()
  id: Types.ObjectId;
}
