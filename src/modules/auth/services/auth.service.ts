import { compareBcrypt } from '@/common/helpers/function';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';
import { expiresInRedis } from '@/config/jwt';
import { UserException } from '@/exception/UserException';
import { LoginUserDto } from '@/modules/auth/dto/login.dto';
import { Payload } from '@/modules/auth/interface/InterfacePayload';
import { LoginTransform } from '@/modules/auth/transformers/login.transform';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import JSONbig from 'json-bigint';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async signIn(dto: LoginUserDto): Promise<LoginTransform> {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: {
          email: dto.email,
        },
      });
      const userId = user.id.toString();

      if (!user || !(await compareBcrypt(dto.password, user.password))) {
        throw new UserException(
          'Email or Password is incorrect!',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const payload: Payload = {
        iss: 'clone-jira',
        sub: userId,
        jit: uuidv4(),
      };
      const token = await this.jwtService.signAsync(payload);

      await this.redisService.setUserCache(JSONbig.stringify(user), userId);
      await this.redisService.setToken(token, userId, payload.jit);

      return plainToClass(LoginTransform, { token, user });
    });
  }
}
