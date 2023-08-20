import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { RoleModule } from '../role/role.module';
import { IRoleModel, ROLE_MODEL_NAME } from '../role/schemas/role.schema';
import { IUserModel, USER_MODEL_NAME } from '../user/schema/user.schema';
import { UserModule } from '../user/user.module';
import { SeedService } from './seed.service';

describe('SeedService', () => {
  let service: SeedService;
  let mongoInstance: MongoMemoryServer;
  let testingModule: TestingModule;
  let userModel: IUserModel;
  let roleModel: IRoleModel;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongoInstance = await MongoMemoryServer.create();
            const uri = mongoInstance.getUri();

            return { uri };
          },
        }),
        RoleModule,
        UserModule,
      ],
      providers: [SeedService],
    }).compile();

    service = testingModule.get<SeedService>(SeedService);
    userModel = testingModule.get<IUserModel>(getModelToken(USER_MODEL_NAME));
    roleModel = testingModule.get<IRoleModel>(getModelToken(ROLE_MODEL_NAME));
  });

  afterAll(async () => {
    await mongoInstance.stop();
    await testingModule.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should seed data', async () => {
    const createUserSpy = jest.spyOn(userModel, 'create');
    const createRoleSpy = jest.spyOn(roleModel, 'create');

    await service.seedAll();

    expect(createUserSpy).toBeCalled();
    expect(createRoleSpy).toBeCalled();
  });

  it('should fail to seed data if already seeded', async () => {
    const createUserSpy = jest.spyOn(userModel, 'create');
    const createRoleSpy = jest.spyOn(roleModel, 'create');

    await service.seedAll();

    expect(createUserSpy).toBeCalled();
    expect(createRoleSpy).toBeCalled();
  });
});
