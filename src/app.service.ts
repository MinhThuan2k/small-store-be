import { Injectable, Req, Res } from '@nestjs/common';

import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class AppService {
  hello(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    return res.send('Clone Jira Hello World!');
  }
}
