import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AppModule } from 'src/app.module';
import { AuthService } from 'src/modules/auth/auth.service';
import * as seed from 'src/modules/seed/seed.json';
import { CreateUserDto } from 'src/modules/user/dto';
import { UserService } from 'src/modules/user/user.service';
import * as request from 'supertest';

describe('User', () => {
  let app: INestApplication;
  let userService: UserService;
  let authService: AuthService;
  let superAdminUser = seed.user.find((user) => user.role.type === 'SUPER ADMIN');
  let employeeUser = seed.user.find((user) => user.role.type === 'EMPLOYEE');
  let superAdminUserToken: string;
  let employeeUserToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication().useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );

    userService = moduleFixture.get<UserService>(UserService);
    authService = moduleFixture.get<AuthService>(AuthService);

    await app.init();

    const superAdminUserAuthResponsePayloadDto = await authService.signIn({
      email: superAdminUser.email,
      password: superAdminUser.password,
    });

    const employeeUserAuthResponsePayloadDto = await authService.signIn({
      email: employeeUser.email,
      password: employeeUser.password,
    });

    superAdminUserToken = superAdminUserAuthResponsePayloadDto.data.accessToken;
    employeeUserToken = employeeUserAuthResponsePayloadDto.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a new user', async () => {
    const newUser = structuredClone(seed.user.find((user) => user.role.type === 'EMPLOYEE'));

    delete newUser._id;
    newUser.email = 'test@test.com';

    await request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${superAdminUserToken}`)
      .send(newUser)
      .expect(({ body }) => {
        expect(body.payload.data).toEqual(expect.objectContaining({ ...(delete newUser.password && newUser) }));
      })
      .expect(201);
  });

  it('should be able to update a user', async () => {
    const newUser = seed.user.find((user) => user.role.type === 'EMPLOYEE');

    newUser.firstName = 'testtt';

    await request(app.getHttpServer())
      .patch(`/user/${newUser._id}`)
      .set('Authorization', `Bearer ${superAdminUserToken}`)
      .send({ firstName: newUser.firstName })
      .expect(({ body }) => {
        expect(body.payload.data).toEqual(expect.objectContaining({ firstName: 'testtt' }));
      })
      .expect(200);
  });

  it('should be able to delete a user', async () => {
    const newUser = structuredClone(seed.user.find((user) => user.role.type === 'EMPLOYEE'));

    delete newUser._id;
    newUser.email = 'test2@test.com';

    const createUserDto: CreateUserDto = {
      ...newUser,
      role: { _id: new Types.ObjectId('64a27b8af50be6424ede3df8'), type: 'EMPLOYEE' },
    };

    const { data: createdUser } = await userService.create(createUserDto);

    await request(app.getHttpServer())
      .delete(`/user/${createdUser._id.toString()}`)
      .set('Authorization', `Bearer ${superAdminUserToken}`)
      .expect(200);
  });

  it('should be able to get all users', async () => {
    await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${superAdminUserToken}`)
      .expect(({ body }) => {
        expect(body.payload.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: expect.any(String),
              firstName: expect.any(String),
              lastName: expect.any(String),
              email: expect.any(String),
              role: expect.objectContaining({
                _id: expect.any(String),
                type: expect.any(String),
              }),
            }),
          ]),
        );
      })
      .expect(200);
  });

  it('should be able to get a user by id', async () => {
    const user = structuredClone(seed.user.find((user) => user.role.type === 'EMPLOYEE'));

    delete user.password;
    user.email = user.email.toLowerCase();

    await request(app.getHttpServer())
      .get(`/user/${user._id.toString()}`)
      .set('Authorization', `Bearer ${superAdminUserToken}`)
      .expect(({ body }) => {
        expect(body.payload.data).toEqual(expect.objectContaining(user));
      })
      .expect(200);
  });

  it('should not be able to create a user without user create permission', async () => {
    const newUser = structuredClone(seed.user.find((user) => user.role.type === 'EMPLOYEE'));

    delete newUser._id;
    newUser.email = 'test3@gmail.com';

    await request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${employeeUserToken}`)
      .send(newUser)
      .expect(({ body }) => {
        expect(body.payload).toEqual(expect.objectContaining({ message: 'Forbidden' }));
      })
      .expect(403);
  });

  it('should not be able to update a user without user update permission', async () => {
    const newUser = structuredClone(seed.user.find((user) => user.role.type === 'EMPLOYEE'));

    await request(app.getHttpServer())
      .patch(`/user/${newUser._id}`)
      .set('Authorization', `Bearer ${employeeUserToken}`)
      .send({ firstName: 'testtt' })
      .expect(({ body }) => {
        expect(body.payload).toEqual(expect.objectContaining({ message: 'Forbidden' }));
      })
      .expect(403);
  });

  it('should not be able to delete a user without user delete permission', async () => {
    const newUser = structuredClone(seed.user.find((user) => user.role.type === 'EMPLOYEE'));

    await request(app.getHttpServer())
      .delete(`/user/${newUser._id}`)
      .set('Authorization', `Bearer ${employeeUserToken}`)
      .expect(({ body }) => {
        expect(body.payload).toEqual(expect.objectContaining({ message: 'Forbidden' }));
      })
      .expect(403);
  });
});
