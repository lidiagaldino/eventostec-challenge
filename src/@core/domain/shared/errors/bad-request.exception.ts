import { Exception } from './exception';

export class BadRequestException extends Exception {
  constructor(message: string) {
    super(message, 400);
  }
}
