import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdDto } from 'src/shared/dto';
import { assertReturn } from 'src/shared/utils';
import { Permission } from '../auth/decorators';
import { ResourceEnum, ResourceOperationEnum } from '../role/types';
import { CreateUserDto, FindAllUsersDto, UpdateUserDto, UserResponseDto, UsersResponseDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Permission({ resource: ResourceEnum.USER, resourceOperation: ResourceOperationEnum.CREATE })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const payload = await this.userService.create(createUserDto);

    return new UserResponseDto({
      payload,
      message: 'User created successfully',
      statusCode: 201,
    });
  }

  @Get()
  @Permission({ resource: ResourceEnum.USER, resourceOperation: ResourceOperationEnum.READ })
  async findAll(@Query() findAllUsersDto: FindAllUsersDto): Promise<UsersResponseDto> {
    const payload = await this.userService.findAll(findAllUsersDto);

    return new UsersResponseDto({
      payload,
      message: 'Users retrieved successfully',
    });
  }

  @Get(':id')
  @Permission({ resource: ResourceEnum.USER, resourceOperation: ResourceOperationEnum.READ })
  async findOne(@Param() { id }: IdDto): Promise<UserResponseDto> {
    const payload = await this.userService.findOne(id);

    assertReturn(payload, 'User not found');

    return new UserResponseDto({
      payload,
      message: 'User retrieved successfully',
    });
  }

  @Patch(':id')
  @Permission({ resource: ResourceEnum.USER, resourceOperation: ResourceOperationEnum.UPDATE })
  async update(@Param() { id }: IdDto, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const payload = await this.userService.update(id, updateUserDto);

    return new UserResponseDto({
      payload,
      message: 'User updated successfully',
    });
  }

  @Delete(':id')
  @Permission({ resource: ResourceEnum.USER, resourceOperation: ResourceOperationEnum.DELETE })
  async remove(@Param() { id }: IdDto): Promise<UserResponseDto> {
    const payload = await this.userService.remove(id);

    return new UserResponseDto({
      payload,
      message: 'User deleted successfully',
    });
  }
}
