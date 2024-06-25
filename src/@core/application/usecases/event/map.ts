import { TEventOutputDTO } from '../../dto/event.dto';
import { Event } from '../../../domain/entities/event.entity';

export const mapEventOutput = (event: Event): TEventOutputDTO => {
  return {
    id: event.getId(),
    title: event.getTitle(),
    description: event.getDescription(),
    date: event.getDate(),
    remote: event.getRemote(),
    img_url: event.getImgUrl().getUrl(),
    event_url: event.getEventUrl().getUrl(),
    address: event.getAddress() ? {
      city: event.getAddress().getCity(),
      uf: event.getAddress().getUf(),
    } : null,
    owner_id: event.getOwner().getId(),
    partners_id: event.getPartners()?.map(partner => partner.getId())
  };
};
