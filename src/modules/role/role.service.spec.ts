import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Types } from 'mongoose';
import { UserService } from '../user/user.service';
import { CreateRoleDto, FindAllRolesDto, UpdateRoleDto } from './dto';
import { RoleMongooseDynamicModule } from './role.module';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let roleService: RoleService;
  let roleId: Types.ObjectId;
  let mongoInstance: MongoMemoryServer;
  let testingModule: TestingModule;
  let userService: UserService;

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
        RoleMongooseDynamicModule,
      ],
      providers: [RoleService],
    })
      .useMocker((token) => {
        if (token === UserService) {
          return {
            findOne: jest.fn().mockReturnValue({ data: {} }),
          };
        }
      })
      .compile();

    roleService = testingModule.get<RoleService>(RoleService);
    userService = testingModule.get<UserService>(UserService);
  });

  afterAll(async () => {
    await mongoInstance.stop();
    await testingModule.close();
  });

  it('should be defined', () => {
    expect(roleService).toBeDefined();
  });

  it('should be able to create role', async () => {
    const createRoleDto: CreateRoleDto = {
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
    };

    const { data: role } = await roleService.create(createRoleDto);

    expect(role).toBeDefined();

    const plainRole = role.toJSON();

    expect(plainRole.type).toEqual(createRoleDto.type);
    expect(plainRole.permission).toEqual(createRoleDto.permission);

    roleId = role._id;
  });

  it('should be able to update role', async () => {
    const updateRoleDto: UpdateRoleDto = {
      permission: {
        user: {
          create: false,
          read: false,
          update: false,
          delete: false,
        },
        role: {
          create: false,
          read: false,
          update: false,
          delete: false,
        },
      },
    };

    const { data: role } = await roleService.update(roleId, updateRoleDto);

    expect(role).toBeDefined();

    const plainRole = role.toJSON();

    expect(plainRole.permission).toEqual(updateRoleDto.permission);
  });

  it('should be able to find all roles', async () => {
    const findAllRolesDto: FindAllRolesDto = {
      page: 1,
      limit: 10,
    };

    const { data: roles, limit, page, pages, total } = await roleService.findAll(findAllRolesDto);

    expect(roles?.length).toEqual(1);
    expect(limit).toEqual(findAllRolesDto.limit);
    expect(page).toEqual(findAllRolesDto.page);
    expect(pages).toEqual(1);
    expect(total).toEqual(1);
  });

  it('should not be able to delete role', async () => {
    expect.assertions(2);
    const spy: jest.SpyInstance = jest.spyOn(userService, 'findOne').mockResolvedValueOnce({ data: {} } as any);

    try {
      await roleService.remove(roleId);
    } catch (error) {
      expect(error).toBeDefined();
      expect(spy).toBeCalledTimes(1);
    }
  });

  it('should be able to find role', async () => {
    const { data: role } = await roleService.findOne(roleId);

    expect(role).toBeDefined();
  });

  it('should be able to delete role', async () => {
    const spy: jest.SpyInstance = jest.spyOn(userService, 'findOne').mockResolvedValueOnce({ data: null } as any);

    const { data: role } = await roleService.remove(roleId);

    expect(spy).toBeCalledTimes(2);

    expect(role).toBeDefined();
  });

  it('should not be able to find role', async () => {
    const { data: role } = await roleService.findOne(roleId);

    expect(role).toBeNull();
  });
});
