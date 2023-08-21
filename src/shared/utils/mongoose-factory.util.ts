import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Environment } from './env.util';

export async function mongooseFactory(
  configService: ConfigService,
): Promise<{ options: MongooseModuleFactoryOptions; instance?: MongoMemoryServer }> {
  const env = configService.get('NODE_ENV');

  if ([Environment.DEVELOPMENT, Environment.TEST].includes(env)) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');

    const mongod = await MongoMemoryServer.create(
      env === Environment.DEVELOPMENT && { instance: { port: +configService.get('MONGODB_IN_MEMORY_PORT') } },
    );

    const uri = mongod.getUri();

    return { options: { uri }, instance: mongod };
  } else {
    const mongodbHost = configService.get('MONGODB_HOST');
    return { options: { uri: mongodbHost } };
  }
}
