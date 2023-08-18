import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { RedisService } from '@songkeys/nestjs-redis';
import { Redis } from 'ioredis';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWTToken } from '../types';

@Injectable()
export class JWTRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  private readonly redisClient: Redis;

  constructor(private readonly configService: ConfigService, private readonly redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET_KEY'),
    });

    this.redisClient = this.redisService.getClient();
  }

  async validate(payload: JWTToken) {
    const { sessionId, _id } = payload;

    const sessions = await this.redisClient.lrange(_id, 0, -1);

    const user = sessions?.find((session) => session === sessionId);

    if (!user)
      throw new UnauthorizedException({
        message: 'Unauthorized',
        errors: { token: 'Invalid refresh token' },
      });

    return payload;
  }
}
