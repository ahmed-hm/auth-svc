import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { CreateUserDto, FindAllUsersDto, UpdateUserDto } from './dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    })
      .useMocker((token) => {
        if (token === UserService) {
          return {
            create: jest.fn().mockReturnValue({ data: { id: 'id' } }),
            findAll: jest.fn().mockReturnValue({ data: [{ id: 'id' }] }),
            findOne: jest.fn().mockReturnValue({ data: { id: 'id' } }),
            update: jest.fn().mockReturnValue({ data: { id: 'id' } }),
            remove: jest.fn().mockReturnValue({ data: { id: 'id' } }),
          };
        }
      })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to create user', async () => {
    const spy = jest.spyOn(userService, 'create');

    const createUserDto: CreateUserDto = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'Jane@gmail.com',
      password: '123456',
    };

    const result = await controller.create(createUserDto);

    expect(result.payload).toEqual({ data: { id: 'id' } });
    expect(spy).toBeCalledWith(createUserDto);
    expect(spy).toBeCalledTimes(1);
  });

  it('should be able to find all users', async () => {
    const spy = jest.spyOn(userService, 'findAll');

    const findAllUsersDto: FindAllUsersDto = {
      limit: 10,
      page: 1,
    };

    const result = await controller.findAll(findAllUsersDto);

    expect(result.payload.data).toEqual([{ id: 'id' }]);
    expect(spy).toBeCalledWith(findAllUsersDto);
    expect(spy).toBeCalledTimes(1);
  });

  it('should be able to find one user', async () => {
    const spy = jest.spyOn(userService, 'findOne');
    const result = await controller.findOne({ id: expect.any(Types.ObjectId) });

    expect(result.payload).toEqual({ data: { id: 'id' } });
    expect(spy).toBeCalledWith(expect.any(Types.ObjectId));
    expect(spy).toBeCalledTimes(1);
  });

  it('should be able to update user', async () => {
    const spy = jest.spyOn(userService, 'update');
    const updateUserDto: UpdateUserDto = {
      firstName: 'Jane',
      lastName: 'Doe',
    };

    const result = await controller.update({ id: expect.any(Types.ObjectId) }, updateUserDto);

    expect(result.payload).toEqual({ data: { id: 'id' } });
    expect(spy).toBeCalledWith(expect.any(Types.ObjectId), updateUserDto);
    expect(spy).toBeCalledTimes(1);
  });

  it('should be able to remove user', async () => {
    const spy = jest.spyOn(userService, 'remove');
    const result = await controller.remove({ id: expect.any(Types.ObjectId) });

    expect(result.payload).toEqual({ data: { id: 'id' } });
    expect(spy).toBeCalledWith(expect.any(Types.ObjectId));
    expect(spy).toBeCalledTimes(1);
  });
});
