import { IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
