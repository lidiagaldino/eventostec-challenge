import { Exception } from './exception';

export class NotFoundException extends Exception {
  constructor(field: string) {
    super(`${field} not found`, 404);
  }
}
