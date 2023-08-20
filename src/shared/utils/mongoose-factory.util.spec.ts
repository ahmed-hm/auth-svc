import { ConfigService } from '@nestjs/config';
import { when } from 'jest-when';
import { mongooseFactory } from './mongoose-factory.util';

describe('MongooseFactory', () => {
  it('should be defined', () => {
    expect(mongooseFactory).toBeDefined();
  });

  it('createMongooseOptions should return mongoose options from in-memory mongodb', async () => {
    const configServiceMock = { get: jest.fn() };

    when(configServiceMock.get)
      .calledWith('NODE_ENV')
      .mockReturnValue('tst')
      .calledWith('MONGODB_HOST')
      .mockReturnValue('mongodb://localhost')
      .calledWith('MONGODB_IN_MEMORY_PORT')
      .mockReturnValue('27018');

    const options = await mongooseFactory(configServiceMock as unknown as ConfigService);

    expect(options).toEqual({
      uri: 'mongodb://127.0.0.1:27018/',
    });
  });

  it('createMongooseOptions should return mongoose options from .env', async () => {
    const configServiceMock = { get: jest.fn() };

    when(configServiceMock.get)
      .calledWith('NODE_ENV')
      .mockReturnValue('stg')
      .calledWith('MONGODB_HOST')
      .mockReturnValue('mongodb://localhost');

    const options = await mongooseFactory(configServiceMock as unknown as ConfigService);

    expect(options).toEqual({
      uri: 'mongodb://localhost',
    });
  });
});
