import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdDto } from 'src/shared/dto';
import { assertReturn } from 'src/shared/utils';
import { Permission } from '../auth/decorators';
import { FindAllRolesDto, RoleResponseDto, RolesResponseDto } from './dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';
import { ResourceEnum, ResourceOperationEnum } from './types';

@ApiBearerAuth()
@ApiTags('Role API')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Permission({ resource: ResourceEnum.ROLE, resourceOperation: ResourceOperationEnum.CREATE })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const payload = await this.roleService.create(createRoleDto);

    return new RoleResponseDto({
      payload,
      message: 'Role created successfully',
      statusCode: 201,
    });
  }

  @Get()
  @Permission({ resource: ResourceEnum.ROLE, resourceOperation: ResourceOperationEnum.READ })
  async findAll(@Query() findAllRolesDto: FindAllRolesDto): Promise<RolesResponseDto> {
    const payload = await this.roleService.findAll(findAllRolesDto);

    return new RolesResponseDto({
      payload,
      message: 'Roles retrieved successfully',
    });
  }

  @Get(':id')
  @Permission({ resource: ResourceEnum.ROLE, resourceOperation: ResourceOperationEnum.READ })
  async findOne(@Param() { id }: IdDto): Promise<RoleResponseDto> {
    const payload = await this.roleService.findOne(id);

    assertReturn(payload, 'Role not found');

    return new RoleResponseDto({
      payload,
      message: 'Role retrieved successfully',
    });
  }

  @Patch(':id')
  @Permission({ resource: ResourceEnum.ROLE, resourceOperation: ResourceOperationEnum.UPDATE })
  async update(@Param() { id }: IdDto, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const payload = await this.roleService.update(id, updateRoleDto);

    return new RoleResponseDto({
      payload,
      message: 'Role updated successfully',
    });
  }

  @Delete(':id')
  @Permission({ resource: ResourceEnum.ROLE, resourceOperation: ResourceOperationEnum.DELETE })
  async remove(@Param() { id }: IdDto): Promise<RoleResponseDto> {
    const payload = await this.roleService.remove(id);

    return new RoleResponseDto({
      payload,
      message: 'Role deleted successfully',
    });
  }
}
