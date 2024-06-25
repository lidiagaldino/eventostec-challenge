import { Exception } from './exception';

export class ConflictException extends Exception {
  constructor(field: string) {
    super(`${field} already exists`, 409);
  }
}
