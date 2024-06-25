import { Exception } from './exception';

export class UnprocessableException extends Exception {
  constructor(message: string) {
    super(message, 422);
  }
}
