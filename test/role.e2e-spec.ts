import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from '@songkeys/nestjs-redis';
import { AppModule } from 'src/app.module';
import { AuthService } from 'src/modules/auth/auth.service';
import { RoleService } from 'src/modules/role/role.service';
import * as seed from 'src/modules/seed/seed.json';
import * as request from 'supertest';

describe('Role', () => {
  let app: INestApplication;
  let roleService: RoleService;
  let redisService: RedisService;
  let authService: AuthService;
  let superAdminUser = seed.user.find((user) => user.role.type === 'SUPER ADMIN');
  let employeeUser = seed.user.find((user) => user.role.type === 'EMPLOYEE');
  let superAdminUserToken: string;
  let employeeUserToken: string;
  let roleId: string;

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

    roleService = moduleFixture.get<RoleService>(RoleService);
    redisService = moduleFixture.get<RedisService>(RedisService);
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

  it('should be able to create a new role', async () => {
    const newRole = structuredClone(seed.role.find((role) => role.type === 'EMPLOYEE'));

    delete newRole._id;
    newRole.type = 'TEST';

    await request(app.getHttpServer())
      .post('/role')
      .set('Authorization', `Bearer ${superAdminUserToken}`)
      .send(newRole)
      .expect(({ body }) => {
        roleId = body.payload.data._id;
        expect(body.payload.data).toEqual(expect.objectContaining(newRole));
      })
      .expect(201);
  });

  it('should be able to get all roles', async () => {
    await request(app.getHttpServer())
      .get('/role')
      .set('Authorization', `Bearer ${superAdminUserToken}`)
      .expect(({ body }) => {
        expect(body.payload.data).toEqual(expect.arrayContaining([expect.objectContaining(seed.role[0])]));
      })
      .expect(200);
  });

  it('should be able to get a role by id', async () => {
    const role = seed.role.find((role) => role.type === 'EMPLOYEE');

    await request(app.getHttpServer())
      .get(`/role/${role._id}`)
      .set('Authorization', `Bearer ${superAdminUserToken}`)
      .expect(({ body }) => {
        expect(body.payload.data).toEqual(expect.objectContaining(role));
      })
      .expect(200);
  });

  it('should be able to update a role by id', async () => {
    const role = seed.role.find((role) => role.type === 'EMPLOYEE');

    await request(app.getHttpServer())
      .patch(`/role/${role._id}`)
      .set('Authorization', `Bearer ${superAdminUserToken}`)
      .send({ type: 'TEST1' })
      .expect(({ body }) => {
        expect(body.payload.data).toEqual(expect.objectContaining({ type: 'TEST1' }));
      })
      .expect(200);
  });

  it('should be able to delete a role by id', async () => {
    await request(app.getHttpServer())
      .delete(`/role/${roleId}`)
      .set('Authorization', `Bearer ${superAdminUserToken}`)
      .expect(200);
  });
});
