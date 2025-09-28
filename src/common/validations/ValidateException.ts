import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(validationErrors: any[]) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors: validationErrors,
      },
      HttpStatus.BAD_REQUEST,
    );
    this.name = 'ValidationError';
  }
}
