import { GoogleOAuth2Service } from '@/modules/auth/services/google-oauth2.service';
import { Injectable } from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';

@Injectable()
export class Oauth2Google {
  readonly iss = ['https://accounts.google.com', 'accounts.google.com'];
  constructor(private oauth2Client: GoogleOAuth2Service) {}

  async verify(token: string) {
    try {
      const ticket = await this.oauth2Client.oauth2Client.verifyIdToken({
        idToken: token,
      });
      const payload = ticket.getPayload();
      return payload;
    } catch {
      throw new JsonWebTokenError('Token google is invalid!');
    }
  }
}
