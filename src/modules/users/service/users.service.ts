import { hashBcrypt } from '@/common/helpers/function';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UserException } from '@/exception/UserException';
import { FastifyRequestWithUser } from '@/middleware/Authentication';
import { ChangePasswordDto } from '@/modules/users/dto/change-password.dto';
import { SignUpDto } from '@/modules/users/dto/signup.dto';
import { Inject, Injectable, Res } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { User } from '@prisma/client';
import { FastifyReply } from 'fastify';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST)
    private readonly request: FastifyRequestWithUser,
  ) {}

  /**
   * Retrieves user information based on the provided user ID.
   * @param {FastifyRequest} request
   * @returns {Promise<User | null>} The user data if found, otherwise null.
   */
  async getProfile(request: FastifyRequestWithUser): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: request.user.sub,
      },
    });
    return user;
  }

  async changePassword(dto: ChangePasswordDto) {
    const { user } = this.request;

    await this.prisma.user
      .update({
        where: { id: user.id },
        data: {
          password_changed_at: new Date(),
          password: await hashBcrypt(dto.password),
        },
        select: { id: true },
      })
      .catch(() => {
        throw new UserException('User not found');
      });
  }

  async signUp(dto: SignUpDto, @Res() response: FastifyReply) {
    return this.prisma.$transaction(async (tx) => {
      const existEmail = await tx.user.findFirst({
        where: { email: dto.email },
      });
      if (existEmail) {
        throw new UserException('Email already exists');
      }

      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: await hashBcrypt(dto.password),
          name: dto.name,
        },
      });
      return response.send({ message: 'Create user successfully' });
    });
  }
}
