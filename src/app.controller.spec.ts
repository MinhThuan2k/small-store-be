import AppController from '@/app.controller';
import { AppService } from '@/app.service';
import { Test, TestingModule } from '@nestjs/testing';
import { FastifyReply, FastifyRequest } from 'fastify';

describe('AppController', () => {
  let appController: AppController;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    const req = {} as FastifyRequest;
    const res = {
      send: jest.fn(),
    } as unknown as FastifyReply;
    it('Clone Jira Backend Hello World!', () => {
      appController.hello(req, res);
      expect(res.send).toHaveBeenCalledWith('Clone Jira Hello World!');
    });
  });
});
