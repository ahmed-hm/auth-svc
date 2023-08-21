import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '@songkeys/nestjs-redis';
import { hashSync } from 'bcryptjs';
import { HydratedDocumentFromSchema, Types } from 'mongoose';
import { UserSchema } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JWTToken } from './types';

describe('AuthService', () => {
  let authService: AuthService;
  let redisService: RedisService;
  const mockAuthorizedUser: Partial<HydratedDocumentFromSchema<UserSchema>> = {
    _id: new Types.ObjectId('64a27b8af50be6424ede3dfb'),
    firstName: 'John',
    lastName: 'Doe',
    email: 'John@gmail.com',
    password: hashSync('123456', 10),
    role: { _id: new Types.ObjectId('64a27b8af50be6424ede3df8'), type: 'SUPER ADMIN' },
    populate: jest.fn().mockReturnValue({
      _id: new Types.ObjectId('64a27b8af50be6424ede3dfb'),
      firstName: 'John',
      lastName: 'Doe',
      username: 'JohnDoe',
      email: 'John@gmail.com',
      password: hashSync('123456', 10),
      role: { _id: { _id: new Types.ObjectId('64a27b8af50be6424ede3df8'), type: 'SUPER ADMIN', permission: {} } },
      toJSON: jest.fn().mockReturnValue({
        _id: new Types.ObjectId('64a27b8af50be6424ede3dfb'),
        firstName: 'John',
        lastName: 'Doe',
        username: 'JohnDoe',
        email: 'John@gmail.com',
        role: { _id: new Types.ObjectId('64a27b8af50be6424ede3df8'), type: 'SUPER ADMIN' },
      }),
    }),
  };
  const mockUnauthorizedUser: Partial<HydratedDocumentFromSchema<UserSchema>> = {
    ...mockAuthorizedUser,
    password: hashSync('1234567', 10),
  };
  const userJWT: JWTToken = {
    _id: '64a27b8af50be6424ede3dfb',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@gmail.com',
    role: {
      _id: '64a27b8af50be6424ede3df8',
      type: 'SUPER ADMIN',
      permission: {
        user: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
        role: {
          create: true,
          read: true,
          update: true,
          delete: true,
        },
      },
    },
    sessionId: 'efe391c9-a2ea-5b68-bd48-52aab3ef0d94',
  };
  const redisClient = {
    lpush: jest.fn().mockReturnValue(1),
    lrem: jest.fn().mockReturnValue(1),
    del: jest.fn().mockReturnValue(1),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === ConfigService) {
          return { get: jest.fn().mockReturnValue('secret') };
        }
        if (token === JwtService) {
          return { signAsync: jest.fn().mockReturnValue('token') };
        }
        if (token === RedisService) {
          return { getClient: jest.fn().mockReturnValue(redisClient) };
        }
        if (token === UserService) {
          return { findOne: jest.fn().mockReturnValue({ data: mockAuthorizedUser }) };
        }
      })
      .compile();

    authService = module.get<AuthService>(AuthService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('redis service should be defined', () => {
    expect(redisService).toBeDefined();
  });

  it('authorized user should be able to sign in', async () => {
    const lpushSpy = jest.spyOn(redisClient, 'lpush');
    const signInDto = {
      email: mockAuthorizedUser.email,
      password: mockAuthorizedUser.password,
    };

    const result = await authService.signIn({ ...signInDto, password: '123456' });

    expect(result?.data).toEqual({ accessToken: 'token', refreshToken: 'token' });
    expect(lpushSpy).toBeCalledTimes(1);

    lpushSpy.mockRestore();
  });

  it('unauthorized user should not be able to sign in', async () => {
    expect.assertions(2);
    const signInDto = {
      email: mockUnauthorizedUser.email,
      password: mockUnauthorizedUser.password,
    };

    try {
      await authService.signIn({ ...signInDto, password: '1234567' });
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toEqual('Invalid password');
    }
  });

  it('should be able to sign out', async () => {
    const lremSpy = jest.spyOn(redisClient, 'lrem');

    await authService.signOut(userJWT);

    expect(lremSpy).toBeCalledTimes(1);

    lremSpy.mockRestore();
  });

  it('should be able to sign out from all devices', async () => {
    const delSpy = jest.spyOn(redisClient, 'del');

    await authService.invalidateSessions(userJWT);

    expect(delSpy).toBeCalledTimes(1);

    delSpy.mockRestore();
  });

  it('should be able to refresh token', async () => {
    const lpushSpy = jest.spyOn(redisClient, 'lpush');
    const lremSpy = jest.spyOn(redisClient, 'lrem');

    await authService.refreshToken(userJWT);

    expect(lpushSpy).toBeCalledTimes(1);
    expect(lremSpy).toBeCalledTimes(1);

    lpushSpy.mockRestore();
  });
});
