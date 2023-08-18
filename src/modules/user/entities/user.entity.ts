import { IsEmail, IsOptional, IsString } from 'class-validator';
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
}
