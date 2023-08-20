import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { JWTGuard, PermissionGuard } from './modules/auth/guards';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { GlobalHandler } from './shared/exception-handlers';
import { configSchema } from './shared/schemas/joi';
import { mongooseFactory } from './shared/utils';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: configSchema() }),
    MongooseModule.forRootAsync({ inject: [ConfigService], useFactory: mongooseFactory }),
    UserModule,
    RoleModule,
    AuthModule,
    SeedModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalHandler },
    { provide: APP_GUARD, useClass: JWTGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {}
