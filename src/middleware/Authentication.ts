import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { expiresInRedis, jwtSecret } from '../config/jwt';
import { FastifyRequest } from 'fastify';
import { Reflector } from '@nestjs/core';
import { RedisService } from '@/common/redis/redis.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Oauth2Google } from '@/middleware/Oauth2Google';
import { UserException } from '@/exception/UserException';
import { Payload } from '@/modules/auth/interface/InterfacePayload';
import { User } from '@prisma/client';

@Injectable()
export class Authentication implements CanActivate {
  readonly arrEqualTokenProvider = [...this.oauth2Google.iss];
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private redisService: RedisService,
    private prisma: PrismaService,
    private oauth2Google: Oauth2Google,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.reflector.get<boolean>('noAuth', context.getHandler())) {
      return true;
    }

    const request = context.switchToHttp().getRequest<FastifyRequestWithUser>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UserException('Token is not provided', HttpStatus.UNAUTHORIZED);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });
      const key = `${this.redisService.prefixUser}:${payload.sub}:${payload.jit}`;
      const userData = await this.redisService.get(key);
      const decryptToken = await this.redisService.decryptToken(userData);

      // Authentication Google
      if (this.oauth2Google.iss.includes(payload.extend_iss)) {
        await this.oauth2Google.verify(decryptToken).catch((err) => {
          throw new JsonWebTokenError(err);
        });
      } else if (token !== decryptToken) {
        throw new JsonWebTokenError('Invalid or unverified token');
      }

      const user = await this.prisma.user.findFirst({
        where: { id: payload.sub },
      });
      if (
        !user ||
        (user.password_changed_at &&
          new Date(payload.iat * 1000) < user.password_changed_at)
      ) {
        throw new JsonWebTokenError(user ? 'Token expired' : 'User not found');
      }

      request.user = {
        ...payload,
        id: user.id,
        name: user.name,
        email: user.email,
      };
      await this.redisService.client.expire(key, expiresInRedis);
    } catch (e) {
      throw e instanceof JsonWebTokenError
        ? new JsonWebTokenError(e.message)
        : new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export interface FastifyRequestWithUser extends FastifyRequest {
  user: Payload &
    Pick<User, 'id' | 'email' | 'name'> & { iat: number; exp: number };
}
