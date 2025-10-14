import { Body, Controller, Injectable, Post } from '@nestjs/common';

import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from '@/modules/auth/services/auth.service';
import { NoAuth } from '@/middleware/NoAuth';
import { ValidationPipe } from '@/common/validations/ValidationPipe';
import { LoginUserDto } from '@/modules/auth/dto/login.dto';
import { LoginTransform } from '../transformers/login.transform';

@ApiTags('Authentication')
@Controller({ version: '1' })
@Injectable()
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @NoAuth()
  @Post('sign-in')
  @ApiOperation({ summary: 'Login JWT Token', description: 'Login JWT Token' })
  @ApiOkResponse({ description: 'Login success', type: LoginTransform })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password',
    schema: {
      example: {
        success: false,
        error: 'UserException',
        message: 'Email or Password is incorrect!',
      },
    },
  })
  async signIn(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.signIn(loginUserDto);
  }
}
