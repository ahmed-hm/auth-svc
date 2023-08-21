import { ConfigService } from '@nestjs/config';
import { RedisModuleOptions } from '@songkeys/nestjs-redis';
import RedisMemoryServer from 'redis-memory-server';
import { Environment } from './env.util';

export async function redisFactory(
  configService: ConfigService,
): Promise<{ options: RedisModuleOptions; instance?: RedisMemoryServer }> {
  const env = configService.get('NODE_ENV');

  if ([Environment.DEVELOPMENT, Environment.TEST].includes(env)) {
    const { RedisMemoryServer } = await import('redis-memory-server');

    const redis = await RedisMemoryServer.create(
      env === Environment.DEVELOPMENT && { instance: { port: +configService.get('REDIS_IN_MEMORY_PORT') } },
    );

    const host = await redis.getHost();
    const port = await redis.getPort();

    return { options: { config: { host, port } }, instance: redis };
  } else {
    const host = configService.get('REDIS_HOST');
    const port = configService.get('REDIS_PORT');
    return { options: { config: { host, port } } };
  }
}
