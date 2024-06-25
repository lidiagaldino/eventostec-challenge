
import { IUserPayload } from './user-payload.interface';

export interface IUserCryptography {
  verify(token: string): IUserPayload;
  encrypt(object: IUserPayload): string;
  isOwner(token: string): boolean;
}
