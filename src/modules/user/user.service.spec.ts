import { NotFoundException } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Types } from 'mongoose';
import { CreateUserDto, FindAllUsersDto, UpdateUserDto } from './dto';
import { IUserModel, USER_MODEL_NAME } from './schema/user.schema';
import { UserMongooseDynamicModule } from './user.module';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let mongoInstance: MongoMemoryServer;
  let testingModule: TestingModule;
  let userModel: IUserModel;
  let userId: Types.ObjectId;
  const createUserDto: CreateUserDto = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'Jane@gmail.com',
    password: '123456',
    role: { _id: new Types.ObjectId(), type: 'SUPER ADMIN' },
  };

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
        UserMongooseDynamicModule,
      ],
      providers: [UserService],
    }).compile();

    userService = testingModule.get<UserService>(UserService);
    userModel = testingModule.get<IUserModel>(getModelToken(USER_MODEL_NAME));
  });

  afterAll(async () => {
    await mongoInstance.stop();
    await testingModule.close();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('user model should be defined', () => {
    expect(userModel).toBeDefined();
  });

  it('should create user', async () => {
    const { data: user } = await userService.create(createUserDto);

    const { password, email, ...restOfCreateUserDto } = createUserDto;

    expect(user.toObject()).toEqual(expect.objectContaining(restOfCreateUserDto));
    expect(user.password).not.toBe(createUserDto.password);
    expect(user.email).toBe(createUserDto.email.toLowerCase());

    userId = user._id;
  });

  it('should find user by id', async () => {
    const { data: user } = await userService.findOne(userId);

    expect(user._id).toEqual(userId);
  });

  it('should find all users', async () => {
    const findAllUsersDto: FindAllUsersDto = {
      limit: 10,
      page: 1,
    };

    const { data: users, limit, page, pages, total } = await userService.findAll(findAllUsersDto);

    expect(users).toHaveLength(1);
    expect(limit).toBe(findAllUsersDto.limit);
    expect(page).toBe(findAllUsersDto.page);
    expect(pages).toBe(1);
    expect(total).toBe(1);
  });

  it('should find searched users', async () => {
    const findAllUsersDto: FindAllUsersDto = {
      search: 'Jane',
      limit: 10,
      page: 1,
    };

    const { data: users, limit, page, pages, total } = await userService.findAll(findAllUsersDto);

    expect(users).toHaveLength(1);
    expect(limit).toBe(findAllUsersDto.limit);
    expect(page).toBe(findAllUsersDto.page);
    expect(pages).toBe(1);
    expect(total).toBe(1);
  });

  it('should not find any user with wrong search', async () => {
    const findAllUsersDto: FindAllUsersDto = {
      search: 'wrong',
      limit: 10,
      page: 1,
    };

    const { data: users, limit, page, pages, total } = await userService.findAll(findAllUsersDto);

    expect(users).toHaveLength(0);
    expect(limit).toBe(findAllUsersDto.limit);
    expect(page).toBe(findAllUsersDto.page);
    expect(pages).toBe(0);
    expect(total).toBe(0);
  });

  it('should update user', async () => {
    const updateUserDto: UpdateUserDto = {
      firstName: 'Jane',
      lastName: 'Doe',
    };

    const { data: user } = await userService.update(userId, updateUserDto);

    expect(user.firstName).toEqual(updateUserDto.firstName);
    expect(user.lastName).toEqual(updateUserDto.lastName);
  });

  it('should throw error if user not found', async () => {
    expect.assertions(2);

    const updateUserDto: UpdateUserDto = {
      firstName: 'Jane',
      lastName: 'Doe',
    };

    try {
      await userService.update(new Types.ObjectId(), updateUserDto);
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('User not found');
    }
  });

  it('should delete user', async () => {
    const { data: user } = await userService.remove(userId);

    expect(user._id).toEqual(userId);
  });

  it('cannot find deleted user', async () => {
    const { data: user } = await userService.findOne(userId);

    expect(user).toBeNull();
  });
});
