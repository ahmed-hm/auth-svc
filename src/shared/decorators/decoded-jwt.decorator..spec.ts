import { ExecutionContext } from '@nestjs/common';
import { createParamDecoratorCallback, DecodedJWT } from './decoded-jwt.decorator';

describe('DecodedJwt', () => {
  let dataMock: unknown;
  let ctxMock: ExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        user: {},
      }),
    }),
    getClass: jest.fn(),
    getHandler: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  };

  it('should be defined', () => {
    expect(DecodedJWT).toBeDefined();
  });

  it('callback should return decoded jwt', () => {
    expect(createParamDecoratorCallback(dataMock, ctxMock)).toEqual({});
  });
});
