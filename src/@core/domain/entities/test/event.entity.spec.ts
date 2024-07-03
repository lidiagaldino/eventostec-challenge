import { Guard, GuardResponse } from '../../shared/guard/guard';
import { Result } from '../../shared/result/result';
import { Address } from '../../value-objects/address.value-object';
import { Email } from '../../value-objects/email.value-object';
import { Password } from '../../value-objects/password.value-object';
import { Url } from '../../value-objects/url.value-object';
import { Event, TEventProps } from '../event.entity';
import { Owner } from '../owner.entity';
import { User } from '../user.entity';

describe('Event', () => {
  describe('create', () => {
    it('should return a new Event instance with valid props', () => {
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

      const result = Event.create(eventProps);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().getTitle()).toBe(eventProps.title);
      expect(result.getValue().getDescription()).toBe(eventProps.description);
      expect(result.getValue().getDate()).toBe(eventProps.date);
      expect(result.getValue().getRemote()).toBe(eventProps.remote);
      expect(result.getValue().getImgUrl()).toBe(eventProps.img_url);
      expect(result.getValue().getEventUrl()).toBe(eventProps.event_url);
      expect(result.getValue().getAddress()).toBe(eventProps.address);
    });

    it('should return a failure when title is missing', () => {
      const eventProps: any = {
        description: 'This is a test event.',
        date: new Date('2022-01-01'),
        remote: false,
        img_url: Url.create({ url: 'https://example.com/img.jpg' }).getValue(),
        event_url: Url.create({
          url: 'https://example.com/event.html',
        }).getValue(),
        address: Address.create({ city: 'São Paulo', uf: 'SP' }).getValue(),
      };

      const result = Event.create(eventProps);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toEqual('title is null or undefined');
    });

    it('should return a failure when description is missing', () => {
      const eventProps: any = {
        title: 'Test Event',
        date: new Date('2022-01-01'),
        remote: false,
        img_url: Url.create({ url: 'https://example.com/img.jpg' }).getValue(),
        event_url: Url.create({
          url: 'https://example.com/event.html',
        }).getValue(),
        address: Address.create({ city: 'São Paulo', uf: 'SP' }).getValue(),
      };

      const result = Event.create(eventProps);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toEqual(
        'description is null or undefined',
      );
    });

    it('should return a failure when date is missing', () => {
      const eventProps: any = {
        title: 'Test Event',
        description: 'This is a test event.',
        remote: false,
        img_url: Url.create({ url: 'https://example.com/img.jpg' }).getValue(),
        event_url: Url.create({
          url: 'https://example.com/event.html',
        }).getValue(),
        address: Address.create({ city: 'São Paulo', uf: 'SP' }).getValue(),
      };

      const result = Event.create(eventProps);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toEqual('date is null or undefined');
    });

    it('should return a failure when remote is missing', () => {
      const eventProps: any = {
        title: 'Test Event',
        description: 'This is a test event.',
        date: new Date('2022-01-01'),
        img_url: Url.create({ url: 'https://example.com/img.jpg' }).getValue(),
        event_url: Url.create({
          url: 'https://example.com/event.html',
        }).getValue(),
        address: Address.create({ city: 'São Paulo', uf: 'SP' }).getValue(),
      };

      const result = Event.create(eventProps);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toEqual('remote is null or undefined');
    });
  });
});
