import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocumentFromSchema } from 'mongoose';
import { CustomResponse, CustomResponsePayload } from 'src/shared/response';
import { User } from '../entities/user.entity';
import { UserSchema } from '../schema/user.schema';

export type UserResponseData = HydratedDocumentFromSchema<UserSchema>;

export class UserResponseDto implements CustomResponse<HydratedDocumentFromSchema<UserSchema>> {
  payload?: UserResponsePayloadDto;
  message: string = 'Success';
  statusCode: number = 200;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UsersResponseDto implements CustomResponse<HydratedDocumentFromSchema<UserSchema>[]> {
  payload?: UsersResponsePayloadDto;
  message: string = 'Success';
  statusCode: number = 200;

  constructor(partial: Partial<UsersResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UserResponsePayloadDto implements CustomResponsePayload<HydratedDocumentFromSchema<UserSchema>> {
  @ApiProperty({ type: User })
  data: UserResponseData;
  page?: number;
  pages?: number;
  limit?: number;
  total?: number;
}

export class UsersResponsePayloadDto implements CustomResponsePayload<HydratedDocumentFromSchema<UserSchema>[]> {
  @ApiProperty({ type: User, isArray: true })
  data: UserResponseData[];
  page?: number;
  pages?: number;
  limit?: number;
  total?: number;
}
