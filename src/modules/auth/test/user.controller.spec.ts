import { FastifyReply } from 'fastify';
import { Test, TestingModule } from '@nestjs/testing';
import AuthController from '@/modules/auth/controllers/auth.controller';
import { LoginUserDto } from '@/modules/auth/dto/login.dto';
import { AuthModule } from '@/modules/auth/auth.module';
import { LoginTransform } from '@/modules/auth/transformers/login.transform';

describe('UserController', () => {
  let userController: AuthController;
  let userDto: LoginUserDto;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    userController = app.get<AuthController>(AuthController);
    userDto = app.get<LoginUserDto>(LoginUserDto);
  });

  describe('User Login', () => {
    const res = {
      send: jest.fn(),
    } as unknown as FastifyReply;
    it('User Login', () => {
      userController.signIn(userDto, res);
      expect(res.send).toHaveBeenCalledWith(expect.any(LoginTransform));
    });
  });
});
