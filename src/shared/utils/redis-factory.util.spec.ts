import { ConfigService } from '@nestjs/config';
import { when } from 'jest-when';
import { redisFactory } from './redis-factory.util';

describe('RedisFactory', () => {
  it('should be defined', () => {
    expect(redisFactory).toBeDefined();
  });

  it('createRedisOptions should return redis options from in-memory redis', async () => {
    const configServiceMock = { get: jest.fn() };

    when(configServiceMock.get)
      .calledWith('NODE_ENV')
      .mockReturnValue('dev')
      .calledWith('REDIS_HOST')
      .mockReturnValue('redis://localhost')
      .calledWith('REDIS_IN_MEMORY_PORT')
      .mockReturnValue('6379');

    const { options, instance } = await redisFactory(configServiceMock as unknown as ConfigService);

    expect(options).toEqual({
      config: { host: '127.0.0.1', port: 6379 },
    });
    expect(instance).toBeDefined();

    await instance?.stop();
  });

  it('createRedisOptions should return redis options from .env', async () => {
    const configServiceMock = { get: jest.fn() };

    when(configServiceMock.get)
      .calledWith('NODE_ENV')
      .mockReturnValue('stg')
      .calledWith('REDIS_HOST')
      .mockReturnValue('localhost')
      .calledWith('REDIS_PORT')
      .mockReturnValue(6379);

    const { options, instance } = await redisFactory(configServiceMock as unknown as ConfigService);

    expect(options).toEqual({
      config: { host: 'localhost', port: 6379 },
    });

    expect(instance).toBeUndefined();
  });
});
