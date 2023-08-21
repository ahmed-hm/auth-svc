import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@songkeys/nestjs-redis';
import { redisFactory } from 'src/shared/utils/redis-factory.util';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JWTStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => (await redisFactory(configService)).options,
    }),
    UserModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, JWTRefreshStrategy],
})
export class AuthModule {}
