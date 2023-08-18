import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocumentFromSchema } from 'mongoose';
import { CustomResponse, CustomResponsePayload } from 'src/shared/response';
import { Role } from '../entities/role.entity';
import { RoleSchema } from '../schemas/role.schema';

export type RoleResponseData = HydratedDocumentFromSchema<RoleSchema>;

export class RoleResponseDto implements CustomResponse<HydratedDocumentFromSchema<RoleSchema>> {
  payload?: RoleResponsePayloadDto;
  message: string = 'Success';
  statusCode: number = 200;

  constructor(partial: Partial<RoleResponseDto>) {
    Object.assign(this, partial);
  }
}

export class RolesResponseDto implements CustomResponse<HydratedDocumentFromSchema<RoleSchema>[]> {
  payload?: RolesResponsePayloadDto;
  message: string = 'Success';
  statusCode: number = 200;

  constructor(partial: Partial<RolesResponseDto>) {
    Object.assign(this, partial);
  }
}

export class RoleResponsePayloadDto implements CustomResponsePayload<HydratedDocumentFromSchema<RoleSchema>> {
  @ApiProperty({ type: Role })
  data: RoleResponseData;
  page?: number;
  pages?: number;
  limit?: number;
  total?: number;
}

export class RolesResponsePayloadDto implements CustomResponsePayload<HydratedDocumentFromSchema<RoleSchema>[]> {
  @ApiProperty({ type: Role, isArray: true })
  data: RoleResponseData[];
  page?: number;
  pages?: number;
  limit?: number;
  total?: number;
}
