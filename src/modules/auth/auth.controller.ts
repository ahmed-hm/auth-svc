import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DecodedJWT } from 'src/shared/decorators/decoded-jwt.decorator';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JWTRefreshGuard } from './guards';
import { JWTToken } from './types';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    const payload = await this.authService.signIn(signInDto);

    return new AuthResponseDto({
      payload,
      message: 'User signed in successfully',
    });
  }

  @Post('refresh-token')
  @IsPublic()
  @UseGuards(JWTRefreshGuard)
  @ApiBearerAuth()
  async refreshToken(@DecodedJWT() token: JWTToken): Promise<AuthResponseDto> {
    const payload = await this.authService.refreshToken(token);

    return new AuthResponseDto({
      payload,
      message: 'Token refreshed successfully',
    });
  }

  @Post('sign-out')
  @ApiBearerAuth()
  async signOut(@DecodedJWT() token: JWTToken): Promise<AuthResponseDto> {
    await this.authService.signOut(token);

    return new AuthResponseDto({
      message: 'User signed out successfully',
    });
  }

  @Post('invalidate-sessions')
  @ApiBearerAuth()
  async invalidateSessions(@DecodedJWT() token: JWTToken): Promise<AuthResponseDto> {
    await this.authService.invalidateSessions(token);

    return new AuthResponseDto({
      message: 'Sessions invalidated successfully',
    });
  }
}
