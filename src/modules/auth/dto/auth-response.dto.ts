import { CustomResponse, CustomResponsePayload } from 'src/shared/response';
import { TokenDto } from './token.dto';

export class AuthResponseDto implements CustomResponse<TokenDto> {
  payload?: AuthResponsePayloadDto;
  message: string = 'Success';
  statusCode: number = 200;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}

export class AuthResponsePayloadDto implements CustomResponsePayload<TokenDto> {
  data: TokenDto;
}
