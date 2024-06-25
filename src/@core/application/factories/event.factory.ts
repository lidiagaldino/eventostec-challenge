import { Event } from '../../domain/entities/event.entity';
import { Owner } from '../../domain/entities/owner.entity';
import { User } from '../../domain/entities/user.entity';
import { left } from '../../domain/shared/result/left.result';
import { Response } from '../../domain/shared/result/response.result';
import { right } from '../../domain/shared/result/right.result';
import { Address } from '../../domain/value-objects/address.value-object';
import { Url } from '../../domain/value-objects/url.value-object';

type TEventFactoryInput = {
  title: string,
  description: string
  date: Date;
  remote: boolean;
  img_url: string;
  event_url: string;
  owner: Owner
  partners?: User[]
  address?: { city: string; uf: string };
}

export const eventFactory = (props: TEventFactoryInput): Response<Event> => {
  const imgUrl = Url.create({ url: props.img_url });
  if (imgUrl.isFailure) return left(imgUrl);

  const eventUrl = Url.create({ url: props.event_url });
  if (eventUrl.isFailure) return left(eventUrl);

  let address;

  if (props.address) {
    address = Address.create({
      city: props.address.city,
      uf: props.address.uf,
    });
    if (address.isFailure) return left(address);
  } else address = null;

  const event = Event.create({
    ...props,
    address: address ? address.getValue() : null,
    img_url: imgUrl.getValue(),
    event_url: eventUrl.getValue(),
  });
  if (event.isFailure) left(event)
  return right(event);
};
