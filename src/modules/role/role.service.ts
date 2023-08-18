import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocumentFromSchema, Types } from 'mongoose';
import { assertReturn } from 'src/shared/utils';
import { UserService } from '../user/user.service';
import { RoleResponsePayloadDto, RolesResponsePayloadDto } from './dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { FindAllRolesDto } from './dto/find-all-roles.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IRoleModel, RoleSchema, ROLE_MODEL_NAME } from './schemas/role.schema';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(ROLE_MODEL_NAME) private readonly roleModel: IRoleModel,
    private readonly userService: UserService,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponsePayloadDto> {
    const role = await this.roleModel.create(createRoleDto);

    return { data: role };
  }

  async findAll({ limit, page, search }: FindAllRolesDto): Promise<RolesResponsePayloadDto> {
    const [docs, total] = await Promise.all([
      this.roleModel
        .find({ ...(search && { $text: { $search: search, $caseSensitive: false } }) })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort(...(search ? [{ score: { $meta: 'textScore' as const } }] : ['_id'])),
      this.roleModel.countDocuments({ ...(search && { $text: { $search: search, $caseSensitive: false } }) }),
    ]);

    return { page, pages: Math.ceil(total / limit), limit, total, data: docs };
  }

  async findOne(id: Types.ObjectId): Promise<RoleResponsePayloadDto> {
    const role = await this.roleModel.findById(id);

    return { data: role };
  }

  async update(id: Types.ObjectId, { permission }: UpdateRoleDto): Promise<RoleResponsePayloadDto> {
    const { data: role } = await this.findOne(id);

    assertReturn({ data: role }, 'Role not found');

    role.set({ permission });
    await role.save();

    return { data: role };
  }

  async remove(id: Types.ObjectId): Promise<RoleResponsePayloadDto> {
    const { data: role } = await this.findOne(id);

    assertReturn({ data: role }, 'Role not found');

    await this.ensureRoleIsNotUsed(role);

    await role.deleteOne();

    return { data: role };
  }

  private async ensureRoleIsNotUsed(role: HydratedDocumentFromSchema<RoleSchema>) {
    const { data: user } = await this.userService.findOne({ role });

    if (user) {
      throw new ForbiddenException({
        message: 'Cannot delete role with users',
        errors: { id: 'Cannot delete role with users' },
      });
    }
  }
}
