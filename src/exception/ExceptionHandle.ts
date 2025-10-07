import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import * as fs from 'fs-extra';
import * as path from 'path';

@Catch()
export class ExceptionHandle implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<FastifyReply>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const exceptionResponse =
      exception instanceof HttpException
        ? {
            message: (exception.getResponse() as any).message,
            errors: (exception.getResponse() as any).errors,
            statusCode: status,
          }
        : {
            message: exception.message || 'Internal server error',
            statusCode: status,
          };

    // log
    const logsDir = path.join(__dirname, '../../logs');
    const logFileName = `logs-${new Date().toISOString().split('T')[0]}.log`;
    const logFilePath = path.join(logsDir, logFileName);
    await fs.ensureDir(logsDir);
    await fs.appendFile(
      logFilePath,
      `[${new Date().toISOString()}]\t${JSON.stringify({
        url: request.url,
        method: request.method,
        body: request.body,
        headers: request.headers,
      })}\n` +
        `\terror: ${JSON.stringify(exceptionResponse.errors || {})} \n` +
        `\tstack: ${exception.stack} \n`,
    );

    // trả response
    response.status(status).send({
      message: exceptionResponse.message,
      name: exception.name || 'Error',
      error: exceptionResponse.errors || null,
      stack:
        process.env.NODE_ENV === 'development' ? exception?.stack : undefined,
    });
  }
}
