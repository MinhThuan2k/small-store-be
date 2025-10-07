import { ValidationPipe } from '@/common/validations/ValidationPipe';
import { FastifyRequestWithUser } from '@/middleware/Authentication';
import { NoAuth } from '@/middleware/NoAuth';
import { ChangePasswordDto } from '@/modules/users/dto/change-password.dto';
import { SignUpDto } from '@/modules/users/dto/signup.dto';
import { UsersService } from '@/modules/users/service/users.service';
import { ProfileTransform } from '@/modules/users/transform/profile.transform';
import { Body, Controller, Get, Post, Request, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { FastifyReply } from 'fastify';

@ApiTags('Users')
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(
    @Request() req: FastifyRequestWithUser,
    @Res() res: FastifyReply,
  ) {
    const profile = await this.usersService.getProfile(req);
    const result = plainToClass(ProfileTransform, profile, {
      excludeExtraneousValues: true,
    });
    return res.send(result);
  }

  @Post('change-password')
  async changePassword(
    @Body(new ValidationPipe()) req: ChangePasswordDto,
    @Res() res: FastifyReply,
  ) {
    this.usersService.changePassword(req);
    return res.send({ message: 'Changed password successfully' });
  }

  @Post('sign-up')
  @NoAuth()
  async signUp(
    @Body(new ValidationPipe()) req: SignUpDto,
    @Res() response: FastifyReply,
  ) {
    return this.usersService.signUp(req, response);
  }
}
