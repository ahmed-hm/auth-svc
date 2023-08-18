import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { GlobalHandler } from './shared/exception-handlers';
import { configSchema } from './shared/schemas/joi';
import { mongooseFactory } from './shared/utils';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: configSchema() }),
    MongooseModule.forRootAsync({ inject: [ConfigService], useFactory: mongooseFactory }),
  ],
  providers: [{ provide: APP_FILTER, useClass: GlobalHandler }],
})
export class AppModule {}
