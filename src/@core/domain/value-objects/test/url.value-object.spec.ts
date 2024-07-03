import { TUrlProps, Url } from '../url.value-object';

describe('Url', () => {
  describe('create', () => {
    it('should return a valid Url instance', () => {
      const props: TUrlProps = { url: 'https://www.example.com' };
      const result = Url.create(props);
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Url);
    });

    it('should return an error when url is null or undefined', () => {
      const props: TUrlProps = { url: null };
      const result = Url.create(props);
      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toBe('url is null or undefined');
    });

    it('should return an error when url is not a valid URL', () => {
      const props: TUrlProps = { url: 'invalidurl' };
      const result = Url.create(props);
      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toBe('Invalid URL');
    });
  });

  describe('isUrlValid', () => {
    it('should return true for a valid URL', () => {
      expect(Url.isUrlValid('https://www.example.com')).toBe(true);
    });

    it('should return false for an invalid URL', () => {
      expect(Url.isUrlValid('invalidurl')).toBe(false);
    });
  });

  describe('getUrl', () => {
    it('should return the correct URL', () => {
      const props: TUrlProps = { url: 'https://www.example.com' };
      const url = Url.create(props).getValue();
      expect(url.getUrl()).toBe('https://www.example.com');
    });
  });
});
