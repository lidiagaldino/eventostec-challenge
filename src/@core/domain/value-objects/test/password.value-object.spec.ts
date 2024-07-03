import { TPasswordProps, Password } from '../password.value-object';

describe('Password', () => {
  describe('create', () => {
    it('should return success when password is not null or undefined', () => {
      const props: TPasswordProps = { password: 'StrongPassword123' };
      const result = Password.create(props);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Password);
    });

    it('should return failure when password is null or undefined', () => {
      const props: TPasswordProps = { password: null as any };
      const result = Password.create(props);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toEqual('password is null or undefined');
    });

    it('should return failure when password length is less than 8', () => {
      const props: TPasswordProps = { password: 'short' };
      const result = Password.create(props);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toEqual('Text is not at least 8 chars.');
    });

    it('should return success when password length is 8 or more', () => {
      const props: TPasswordProps = { password: 'LongPassword12345678' };
      const result = Password.create(props);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Password);
    });
  });

  describe('getPassword', () => {
    it('should return the same password as provided in create', () => {
      const props: TPasswordProps = { password: 'StrongPassword123' };
      const password = Password.create(props).getValue();

      expect(password.getPassword()).toBe('StrongPassword123');
    });
  });
});
