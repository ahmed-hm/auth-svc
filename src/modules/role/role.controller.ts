import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IdDto } from 'src/shared/dto';
import { assertReturn } from 'src/shared/utils';
import { FindAllRolesDto, RoleResponseDto, RolesResponseDto } from './dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleService } from './role.service';

@ApiBearerAuth()
@ApiTags('Role API')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const payload = await this.roleService.create(createRoleDto);

    return new RoleResponseDto({
      payload,
      message: 'Role created successfully',
      statusCode: 201,
    });
  }

  @Get()
  async findAll(@Query() findAllRolesDto: FindAllRolesDto): Promise<RolesResponseDto> {
    const payload = await this.roleService.findAll(findAllRolesDto);

    return new RolesResponseDto({
      payload,
      message: 'Roles retrieved successfully',
    });
  }

  @Get(':id')
  async findOne(@Param() { id }: IdDto): Promise<RoleResponseDto> {
    const payload = await this.roleService.findOne(id);

    assertReturn(payload, 'Role not found');

    return new RoleResponseDto({
      payload,
      message: 'Role retrieved successfully',
    });
  }

  @Patch(':id')
  async update(@Param() { id }: IdDto, @Body() updateRoleDto: UpdateRoleDto): Promise<RoleResponseDto> {
    const payload = await this.roleService.update(id, updateRoleDto);

    return new RoleResponseDto({
      payload,
      message: 'Role updated successfully',
    });
  }

  @Delete(':id')
  async remove(@Param() { id }: IdDto): Promise<RoleResponseDto> {
    const payload = await this.roleService.remove(id);

    return new RoleResponseDto({
      payload,
      message: 'Role deleted successfully',
    });
  }
}
