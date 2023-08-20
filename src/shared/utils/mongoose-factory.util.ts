import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { Environment } from './env.util';

export async function mongooseFactory(configService: ConfigService): Promise<MongooseModuleFactoryOptions> {
  const env = configService.get('NODE_ENV');

  if ([Environment.DEVELOPMENT, Environment.TEST].includes(env)) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');

    const mongod = await MongoMemoryServer.create({
      instance: { port: +configService.get('MONGODB_IN_MEMORY_PORT') },
    });
    const uri = mongod.getUri();

    return { uri };
  } else {
    const mongodbHost = configService.get('MONGODB_HOST');
    return { uri: mongodbHost };
  }
}
