import { IsEmail, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { SubRole } from 'src/modules/role/entities/sub-role.entity';
import { BaseEntity } from 'src/shared/entities';

export class User extends BaseEntity {
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsObject()
  @ValidateNested()
  role: SubRole;
}
