import { AppService } from '@/app.service';
import { Controller, Get, Injectable, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller()
@Injectable()
export default class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  hello(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    return this.appService.hello(req, res);
  }
}
