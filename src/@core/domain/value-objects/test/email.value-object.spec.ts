import { TEmailProps, Email } from '../email.value-object';

describe('Email', () => {
  describe('create', () => {
    it('should return a success result with a new Email instance when props are valid', () => {
      const props: TEmailProps = { email: 'test@example.com' };
      const result = Email.create(props);
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Email);
    });

    it('should return a failure result with an error when props are invalid', () => {
      const props: TEmailProps = { email: '' };
      const result = Email.create(props);
      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toBe('Invalid email');
    });

    it('should return a failure result with an error when email is not valid', () => {
      const props: TEmailProps = { email: 'invalid-email' };
      const result = Email.create(props);
      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toBe('Invalid email');
    });
  });

  describe('isEmailValid', () => {
    it('should return true when email is valid', () => {
      const email = 'test@example.com';
      expect(Email.isEmailValid(email)).toBe(true);
    });

    it('should return false when email is not valid', () => {
      const email = 'invalid-email';
      expect(Email.isEmailValid(email)).toBe(false);
    });
  });
});
