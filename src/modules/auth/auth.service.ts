import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@songkeys/nestjs-redis';
import { compare } from 'bcryptjs';
import { Redis } from 'ioredis';
import { Types } from 'mongoose';
import { assertReturn } from 'src/shared/utils';
import { v4, v5 } from 'uuid';
import { Role } from '../role/entities/role.entity';
import { UserResponseData } from '../user/dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthResponsePayloadDto } from './dto/auth-response.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JWTToken, UserJWTToken } from './types';

@Injectable()
export class AuthService {
  private readonly redisClient: Redis;

  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getClient();
  }

  async signIn({ email, password }: SignInDto): Promise<AuthResponsePayloadDto> {
    const { data: user } = await this.userService.findOne({ email });

    assertReturn({ data: user }, 'User not found');

    await this.validatePassword(password, user);

    const token = await this.generateTokenPair(user);

    return { data: token };
  }

  async refreshToken({ _id, sessionId }: JWTToken): Promise<AuthResponsePayloadDto> {
    const { data: user } = await this.userService.findOne(new Types.ObjectId(_id));

    assertReturn({ data: user }, 'User not found');

    const token = await this.generateTokenPair(user);

    await this.removeSession(_id, sessionId);

    return { data: token };
  }

  private async validatePassword(password: string, user: User): Promise<void> {
    const isValid = await compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException({
        message: 'Invalid password',
      });
    }
  }

  private async generateTokenPair(user: UserResponseData): Promise<{ accessToken: string; refreshToken: string }> {
    const populatedUser = await user.populate<{
      role: { _id: Pick<Role, 'type' | 'permission'> & { _id: string } };
    }>([{ path: 'role._id', select: '_id type permission' }]);

    const plainUser: UserJWTToken = { ...populatedUser.toJSON(), role: populatedUser.role._id };

    const sessionId = v5(v4(), v4());

    const payload: JWTToken = {
      ...plainUser,
      sessionId,
      password: undefined,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
      }),
    ]);

    await this.redisClient.lpush(user._id.toString(), sessionId);

    return { accessToken, refreshToken };
  }

  private async removeSession(_id: string, sessionId: string): Promise<void> {
    await this.redisClient.lrem(_id, 0, sessionId);
  }
}
