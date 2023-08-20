import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { JWTToken } from './types';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let testingModule: TestingModule;
  let userJWT: JWTToken = {
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

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return {
            signIn: jest.fn().mockReturnValue({
              data: { token: { accessToken: 'access-token', refreshToken: 'refresh-token' } },
            }),
            refreshToken: jest.fn().mockReturnValue({
              data: { token: { accessToken: 'access-token', refreshToken: 'refresh-token' } },
            }),
            signOut: jest.fn(),
            invalidateSessions: jest.fn(),
          };
        }
      })
      .compile();

    controller = testingModule.get<AuthController>(AuthController);
    authService = testingModule.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await testingModule.close();
  });

  it('auth controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('auth service should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('user should be able to sign in', async () => {
    const signInSpy = jest.spyOn(authService, 'signIn');
    const signInDto: SignInDto = { email: 'John@gmail.com', password: '123456' };

    const result = await controller.signIn(signInDto);

    expect(result?.payload?.data).toEqual({ token: { accessToken: 'access-token', refreshToken: 'refresh-token' } });
    expect(signInSpy).toBeCalledWith(signInDto);
    expect(signInSpy).toBeCalledTimes(1);
  });

  it('should be able to refresh token', async () => {
    const refreshTokenSpy = jest.spyOn(authService, 'refreshToken');
    const result = await controller.refreshToken(userJWT);

    expect(result?.payload?.data).toEqual({ token: { accessToken: 'access-token', refreshToken: 'refresh-token' } });
    expect(refreshTokenSpy).toBeCalledWith(userJWT);
    expect(refreshTokenSpy).toBeCalledTimes(1);
  });

  it('should be able to sign out', async () => {
    const signOutSpy = jest.spyOn(authService, 'signOut');
    const result = await controller.signOut(userJWT);

    expect(result).toEqual({ message: 'User signed out successfully', statusCode: 200 });
    expect(signOutSpy).toBeCalledWith(userJWT);
    expect(signOutSpy).toBeCalledTimes(1);
  });

  it('should be able to invalidate all sessions', async () => {
    const invalidateSessionsSpy = jest.spyOn(authService, 'invalidateSessions');
    const result = await controller.invalidateSessions(userJWT);

    expect(result).toEqual({ message: 'Sessions invalidated successfully', statusCode: 200 });
    expect(invalidateSessionsSpy).toBeCalledWith(userJWT);
    expect(invalidateSessionsSpy).toBeCalledTimes(1);
  });
});
