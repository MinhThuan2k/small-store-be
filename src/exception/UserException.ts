import { HttpException, HttpStatus } from '@nestjs/common';

export class UserException extends HttpException {
  constructor(
    message: string | Record<string, any> = 'Bad Request',
    status = HttpStatus.BAD_REQUEST,
  ) {
    super({ statusCode: status, message }, status);
    this.name = UserException.name;
    this.stack = new Error().stack;
  }
}
