import { BadRequestException } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';
import { Types } from 'mongoose';

export function TransformObjectId() {
  return Transform(({ obj, key }: TransformFnParams) => {
    if (!Types.ObjectId.isValid(obj[key])) {
      throw new BadRequestException({
        message: 'Invalid ObjectId',
        errors: 'Invalid ObjectId',
      });
    }

    return new Types.ObjectId(obj[key]);
  });
}
