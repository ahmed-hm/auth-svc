import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { assertReturn } from 'src/shared/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponsePayloadDto, UsersResponsePayloadDto } from './dto/user-response.dto';
import { IUserModel, USER_MODEL_NAME } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER_MODEL_NAME) private readonly userModel: IUserModel) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponsePayloadDto> {
    const user = await this.userModel.create(createUserDto);

    return { data: user };
  }

  async findAll({ page, limit, search }: FindAllUsersDto): Promise<UsersResponsePayloadDto> {
    const [docs, total] = await Promise.all([
      this.userModel
        .find({
          ...(search && { $text: { $search: search, $caseSensitive: false } }),
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(...(search ? [{ score: { $meta: 'textScore' as const } }] : ['_id'])),
      this.userModel.countDocuments({
        ...(search && { $text: { $search: search, $caseSensitive: false } }),
      }),
    ]);

    return { page, pages: Math.ceil(total / limit), limit, total, data: docs };
  }

  async findOne(idOrUser: Types.ObjectId): Promise<UserResponsePayloadDto> {
    const user = await this.userModel.findById(idOrUser);

    return { data: user };
  }

  async update(id: Types.ObjectId, updateUserDto: UpdateUserDto): Promise<UserResponsePayloadDto> {
    const { data: user } = await this.findOne(id);

    assertReturn({ data: user }, 'User not found');

    user.set(updateUserDto);
    await user.save();

    return { data: user };
  }

  async remove(id: Types.ObjectId): Promise<UserResponsePayloadDto> {
    const { data: user } = await this.findOne(id);

    assertReturn({ data: user }, 'User not found');

    await user.deleteOne();

    return { data: user };
  }
}
