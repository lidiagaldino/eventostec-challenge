import { Address } from '../../value-objects/address.value-object';
import { Email } from '../../value-objects/email.value-object';
import { Password } from '../../value-objects/password.value-object';
import { Url } from '../../value-objects/url.value-object';
import { TCouponProps, Coupon } from '../coupon.entity';
import { Event } from '../event.entity';
import { Owner } from '../owner.entity';
import { User } from '../user.entity';

describe('Coupon', () => {
  const event = Event.create({
    date: new Date(),
    title: 'Test',
    description: 'Test description',
    remote: false,
    img_url: Url.create({ url: 'https://example.com/img.jpg' }).getValue(),
    event_url: Url.create({
      url: 'https://example.com/event.html',
    }).getValue(),
    address: Address.create({ city: 'São Paulo', uf: 'SP' }).getValue(),
    owner: Owner.create({
      cpf: '45078224084',
      user: User.create({
        email: Email.create({ email: 'lidia@gmail.com' }).getValue(),
        password: Password.create({ password: '12345678' }).getValue(),
        username: 'Lidia'
      }).getValue()
    }).getValue(),
  }).getValue();

  describe('create', () => {
    it('should return a successful result with a new Coupon instance', () => {
      const couponProps: TCouponProps = {
        discount: 10,
        code: 'ABC123',
        valid: true,
        event,
      };

      const result = Coupon.create(couponProps);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Coupon);
    });

    it('should return a failure result when discount is not provided', () => {
      const couponProps: any = {
        code: 'ABC123',
        valid: true,
        event,
      };

      const result = Coupon.create(couponProps);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toEqual('discount is null or undefined');
    });

    it('should return a failure result when code is not provided', () => {
      const couponProps: any = {
        discount: 10,
        valid: true,
        event,
      };

      const result = Coupon.create(couponProps);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toEqual('code is null or undefined');
    });

    it('should return a failure result when valid is not provided', () => {
      const couponProps: any = {
        discount: 10,
        code: 'ABC123',
        event,
      };

      const result = Coupon.create(couponProps);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toEqual('valid is null or undefined');
    });

    it('should return a failure result when event is not provided', () => {
      const couponProps: any = {
        discount: 10,
        code: 'ABC123',
        valid: true,
      };

      const result = Coupon.create(couponProps);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toEqual('event is null or undefined');
    });
  });
});
