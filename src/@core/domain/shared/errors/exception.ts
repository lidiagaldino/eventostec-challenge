import { HttpException } from '@nestjs/common';

export class Exception extends HttpException {
  constructor(message: string, code: number) {
    super(message, code);
  }
}
