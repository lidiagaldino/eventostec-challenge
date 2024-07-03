import { Address, TAddressProps } from '../address.value-object';

describe('Address', () => {
  describe('create', () => {
    it('should return a success when valid address props are provided', () => {
      const validAddressProps: TAddressProps = {
        city: 'São Paulo',
        uf: 'SP',
      };

      const result = Address.create(validAddressProps);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Address);
    });

    it('should return an error when uf is null or undefined', () => {
      const invalidAddressProps: TAddressProps = {
        city: 'São Paulo',
        uf: null,
      };

      const result = Address.create(invalidAddressProps);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toBe('uf is null or undefined');
    });

    it('should return an error when city is null or undefined', () => {
      const invalidAddressProps: TAddressProps = {
        city: null,
        uf: 'SP',
      };

      const result = Address.create(invalidAddressProps);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toBe('city is null or undefined');
    });
  });
});
