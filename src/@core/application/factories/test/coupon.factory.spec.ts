import { Coupon } from "../../../domain/entities/coupon.entity";
import { Event, TEventProps } from "../../../domain/entities/event.entity";
import { Owner } from "../../../domain/entities/owner.entity";
import { User } from "../../../domain/entities/user.entity";
import { Address } from "../../../domain/value-objects/address.value-object";
import { Email } from "../../../domain/value-objects/email.value-object";
import { Password } from "../../../domain/value-objects/password.value-object";
import { Url } from "../../../domain/value-objects/url.value-object";
import { TCouponFactoryInput, couponFactory } from "../coupon.factory";


describe('couponFactory', () => {
  const eventProps: TEventProps = {
    title: 'Test Event',
    description: 'This is a test event.',
    date: new Date('2022-01-01'),
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
  };
  const validEvent = Event.create(eventProps).getValue();
  const validCouponInput: TCouponFactoryInput = {
    code: 'ABC123',
    discount: 10,
    event: validEvent,
    valid: true,
  };

  it('should return a right result when creating a coupon with valid inputs and a valid event', () => {
    const result = couponFactory(validCouponInput);
    expect(result.isRight()).toBe(true);
    expect(result.value.getValue()).toBeInstanceOf(Coupon);
  });
});
