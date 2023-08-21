import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

describe('Auth', () => {
  let tokenPair: { accessToken: string; refreshToken: string } = { accessToken: '', refreshToken: '' };
  let app: INestApplication;

  const authorizedUser = {
    _id: '64a27b8af50be6424ede3dfb',
    firstName: 'John',
    lastName: 'Doe',
    email: 'John@gmail.com',
    password: '123456',
    role: { _id: '64a27b8af50be6424ede3df8', type: 'SUPER ADMIN' },
  };

  const unauthorizedUser = {
    _id: '64a27b8af50be6424ede3dfb',
    firstName: 'John',
    lastName: 'Doe',
    email: 'John@gmail.com',
    password: '1234567',
    role: { _id: '64a27b8af50be6424ede3df8', type: 'SUPER ADMIN' },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should sign in successfully and return token pair', async () => {
    const authenticatedResponse = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ email: authorizedUser.email, password: authorizedUser.password })
      .expect(({ body }) => {
        expect(body.payload).toEqual(
          expect.objectContaining({
            data: { accessToken: expect.any(String), refreshToken: expect.any(String) },
          }),
        );
      })
      .expect(201);

    const { accessToken, refreshToken } = authenticatedResponse.body.payload.data;
    tokenPair.accessToken = accessToken;
    tokenPair.refreshToken = refreshToken;
  });

  it('should return 401 if user is not authorized', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ email: unauthorizedUser.email, password: unauthorizedUser.password })
      .expect(({ body }) => {
        expect(body.statusCode).toEqual(401);
      })
      .expect(401);
  });

  it('should sign out successfully', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign-out')
      .set('Authorization', `Bearer ${tokenPair.accessToken}`)
      .expect(201);
  });

  it('sign out should return 401 if user is not authorized', async () => {
    const fakeAccessToken: string = 'fakeAccessToken';
    await request(app.getHttpServer())
      .post('/auth/sign-out')
      .set('Authorization', `Bearer ${fakeAccessToken}`)
      .expect(401);
  });

  it('should refresh token successfully', async () => {
    const authenticatedResponse = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ email: authorizedUser.email, password: authorizedUser.password })
      .expect(({ body }) => {
        expect(body.payload).toEqual(
          expect.objectContaining({
            data: { accessToken: expect.any(String), refreshToken: expect.any(String) },
          }),
        );
      })
      .expect(201);

    const { accessToken, refreshToken } = authenticatedResponse.body.payload.data;

    tokenPair.accessToken = accessToken;
    tokenPair.refreshToken = refreshToken;

    await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .set('Authorization', `Bearer ${tokenPair.refreshToken}`)
      .expect(({ body }) => {
        expect(body.payload).toEqual(
          expect.objectContaining({
            data: { accessToken: expect.any(String), refreshToken: expect.any(String) },
          }),
        );
      })
      .expect(201);
  });

  it('should return 401 if refresh token is invalid', async () => {
    const fakeRefreshToken = 'fakeRefreshToken';
    await request(app.getHttpServer())
      .post('/auth/refresh-token')
      .send({ refreshToken: fakeRefreshToken })
      .expect(({ body }) => {
        expect(body.statusCode).toEqual(401);
      })
      .expect(401);
  });

  it('should return 401 if signed out after access token is revoked', async () => {
    await request(app.getHttpServer())
      .post('/auth/sign-out')
      .set('Authorization', `Bearer ${tokenPair.accessToken}`)
      .expect(401);
  });

  it('should return 401 if all sessions are revoked', async () => {
    const authenticatedResponse = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ email: authorizedUser.email, password: authorizedUser.password })
      .expect(({ body }) => {
        expect(body.payload).toEqual(
          expect.objectContaining({
            data: { accessToken: expect.any(String), refreshToken: expect.any(String) },
          }),
        );
      })
      .expect(201);

    const { accessToken, refreshToken } = authenticatedResponse.body.payload.data;
    tokenPair.accessToken = accessToken;
    tokenPair.refreshToken = refreshToken;

    await request(app.getHttpServer())
      .post('/auth/invalidate-sessions')
      .set('Authorization', `Bearer ${tokenPair.accessToken}`)
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/sign-out')
      .set('Authorization', `Bearer ${tokenPair.accessToken}`)
      .expect(401);
  });
});
