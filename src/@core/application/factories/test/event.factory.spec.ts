import { Owner } from "../../../domain/entities/owner.entity";
import { User } from "../../../domain/entities/user.entity";
import { Email } from "../../../domain/value-objects/email.value-object";
import { Password } from "../../../domain/value-objects/password.value-object";
import { TEventFactoryInput, eventFactory } from "../event.factory";
import { Event } from "../../../domain/entities/event.entity";

describe('Event Factory', () => {
  const user = User.create({
    email: Email.create({ email: 'lidia@gmail.com' }).getValue(),
    password: Password.create({ password: '12345678' }).getValue(),
    username: 'Lidia'
  }).getValue()
  const owner = Owner.create({
    cpf: '45078224084',
    user
  }).getValue()
  const validInput: TEventFactoryInput = {
    title: 'Valid Event',
    description: 'This is a valid event',
    date: new Date('2022-01-01'),
    remote: true,
    img_url: 'https://example.com/img.jpg',
    event_url: 'https://example.com/event',
    owner,
    address: { city: 'São Paulo', uf: 'SP' },
  };

  const invalidInput: TEventFactoryInput = {
    title: null,
    description: 'This is a invalid event',
    date: new Date('2022-01-01'),
    remote: false,
    img_url: 'https://example.com/img.jpg',
    event_url: 'https://example.com/event',
    owner,
    address: { city: 'São Paulo', uf: 'SP' },
  };

  it('should create a valid event', () => {
    const result = eventFactory(validInput);
    expect(result.isRight()).toBe(true);
    expect(result.value.getValue()).toBeInstanceOf(Event);
  });

  it('should return an error when input is invalid', () => {
    const result = eventFactory(invalidInput);
    expect(result.isLeft()).toBe(true);
  });

  it('should create a valid event with null address', () => {
    const result = eventFactory({
      ...validInput,
      address: null,
    });
    expect(result.isRight()).toBe(true);
    expect(result.value.getValue()).toBeInstanceOf(Event);
  });

  it('should create a valid event with partners', () => {
    const partners: User[] = [user];
    const result = eventFactory({
      ...validInput,
      partners,
    });
    expect(result.isRight()).toBe(true);
    expect(result.value.getValue()).toBeInstanceOf(Event);
  });

  it('should create a invalid event with invalid urls', () => {
    const invalidImgUrl = 'invalid_url';
    const invalidEventUrl = 'invalid_url';
    const result = eventFactory({
      ...validInput,
      img_url: invalidImgUrl,
      event_url: invalidEventUrl,
    });
    expect(result.isLeft()).toBe(true);
  });
});
