import { Controller, Get, Injectable, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoAuth } from '@/middleware/NoAuth';
import { GoogleOAuth2Service } from '@/modules/auth/services/google-oauth2.service';
import { LoginTransform } from '../transformers/login.transform';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
@Injectable()
export default class OAuth2Controller {
  constructor(private readonly googleOAuth2Service: GoogleOAuth2Service) {}

  @NoAuth()
  @Get('sign-in/google')
  @ApiOperation({ summary: 'Login By Google', description: 'Login By Google' })
  @ApiOkResponse({
    description: 'Successfully returned URL',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'https://www.googleapis.com' },
      },
    },
  })
  async signInGoogle() {
    return this.googleOAuth2Service.signInGoogle();
  }

  @NoAuth()
  @Get('google/callback')
  @ApiOperation({ summary: 'Login JWT Token', description: 'Login JWT Token' })
  @ApiOkResponse({ description: 'Login success', type: LoginTransform })
  async googleCallback(@Query('code') code: string) {
    return await this.googleOAuth2Service.getGoogleUserProfile(code);
  }
}
