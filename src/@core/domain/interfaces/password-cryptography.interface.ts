export interface IPasswordCryptography {
  compare(password: string, hash: string): Promise<boolean>;
  hash(value: string): Promise<string>;
}
