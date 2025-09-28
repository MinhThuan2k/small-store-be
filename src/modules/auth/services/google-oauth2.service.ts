import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { RedisService } from '../../../common/redis/redis.service';
import { v4 as uuidv4 } from 'uuid';
import { Payload } from '../interface/InterfacePayload';
import { expiresInRedis, jwtIssuer } from '../../../config/jwt';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LoginTransform } from '../transformers/login.transform';
import { plainToClass } from 'class-transformer';

@Injectable()
export class GoogleOAuth2Service {
  readonly oauth2Client: OAuth2Client;
  readonly CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID;
  readonly CLIENT_SECRET: string = process.env.GOOGLE_CLIENT_SECRET;
  readonly GOOGLE_CLIENT_OAUTH2_REDIRECT_URI: string =
    process.env.GOOGLE_CLIENT_OAUTH2_REDIRECT_URI;

  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private readonly prisma: PrismaService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.CLIENT_ID,
      this.CLIENT_SECRET,
      this.GOOGLE_CLIENT_OAUTH2_REDIRECT_URI,
    );
  }

  signInGoogle() {
    const authUrl = this.getGoogleAuthUrl();
    return { url: authUrl };
  }

  private getGoogleAuthUrl(): string {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      include_granted_scopes: false,
    });
    return authUrl;
  }

  async getGoogleUserProfile(code: string): Promise<any> {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: this.oauth2Client,
      version: 'v2',
    });
    const { data: userInfoGoogle } = await oauth2.userinfo.v2.me.get();

    const idToken = tokens.id_token;
    const ticketGoogle = await this.oauth2Client.verifyIdToken({
      idToken,
      audience: this.CLIENT_ID,
    });

    const payloadGoogle = ticketGoogle.getPayload();
    const expired = tokens.expiry_date
      ? tokens.expiry_date - Math.floor(Date.now() / 1000)
      : expiresInRedis;

    let user = await this.prisma.user.findFirst({
      where: { email: userInfoGoogle.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: userInfoGoogle.email,
          name: userInfoGoogle.name,
          google_id: userInfoGoogle.id,
        },
      });
    } else if (!user.google_id) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          google_id: userInfoGoogle.id,
        },
      });
    }

    const payload: Payload = {
      iss: jwtIssuer,
      sub: user.id,
      jit: uuidv4(),
      extend_iss: payloadGoogle.iss,
    };
    const token = await this.jwtService.signAsync(payload);
    const cryptoToken = await this.redisService.encryptToken(idToken); // save encrypt token google to redis

    await this.redisService.set(
      `${this.redisService.prefixUser}:${user.id}:${payload.jit}`,
      cryptoToken,
      expired,
    );

    return plainToClass(LoginTransform, { token, user });
  }
}
