import { TransformFnParams } from 'class-transformer';
import { Types } from 'mongoose';
import { transformObjectId, TransformObjectId } from './transform-mongo-id.decorator';

describe('TransformMongoId', () => {
  it('TransformObjectId should be defined', () => {
    expect(TransformObjectId).toBeDefined();
  });

  it('transformObjectId should return transformed object id', () => {
    const params: TransformFnParams = {
      value: undefined,
      key: 'id',
      obj: { id: '5f3e5a7a8e9f4f0017d2d7d5' },
      type: undefined,
      options: undefined,
    };

    expect(transformObjectId(params)).toEqual(expect.any(Types.ObjectId));
  });

  it('transformObjectId should throw BadRequestException', () => {
    expect.assertions(1);

    const params: TransformFnParams = {
      value: undefined,
      key: 'id',
      obj: { id: 'invalid-object-id' },
      type: undefined,
      options: undefined,
    };

    try {
      transformObjectId(params);
    } catch (err) {
      expect(err.message).toBe('Invalid ObjectId');
    }
  });
});
