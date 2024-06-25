import { Address } from '../value-objects/address.value-object';
import { Guard, GuardResponse } from '../shared/guard/guard';
import { Result } from '../shared/result/result';
import { Url } from '../value-objects/url.value-object';
import { Owner } from './owner.entity';
import { User } from './user.entity';

export type TEventProps = {
  title: string;
  description: string;
  date: Date;
  remote: boolean;
  img_url: Url;
  event_url: Url;
  owner: Owner;
  partners?: User[]
  address?: Address;
};

export class Event {
  private id: string;
  private props: TEventProps;

  private constructor(props: TEventProps) {
    this.props = props;
  }

  public static create(event: TEventProps) {
    const guardResults = Guard.combine([
      Guard.againstNullOrUndefined(event.title, 'title'),
      Guard.againstNullOrUndefined(event.description, 'description'),
      Guard.againstNullOrUndefined(event.date, 'date'),
      Guard.againstNullOrUndefined(event.remote, 'remote'),
      Guard.againstNullOrUndefined(event.img_url, 'img_url'),
      Guard.againstNullOrUndefined(event.event_url, 'event_url'),
      Guard.againstNullOrUndefined(event.owner, 'owner'),
      !event.remote
        ? Guard.againstNullOrUndefined(event.address, 'address')
        : Result.ok<GuardResponse>(),
      Guard.againstAtLeast(2, event?.title),
      Guard.againstAtLeast(2, event?.description),
    ]);

    if (guardResults.isFailure) {
      return Result.fail<Event>(guardResults.getErrorValue());
    }

    return Result.ok<Event>(new Event(event));
  }

  public setId(id: string) {
    this.id = id
  }

  public getId() {
    return this.id;
  }

  public getTitle() {
    return this.props.title;
  }

  public getDescription() {
    return this.props.description;
  }

  public getDate() {
    return this.props.date;
  }

  public getRemote() {
    return this.props.remote;
  }

  public getImgUrl() {
    return this.props.img_url;
  }

  public getEventUrl() {
    return this.props.event_url;
  }

  public getAddress() {
    return this.props.address;
  }

  public getOwner() {
    return this.props.owner
  }

  public getPartners() {
    return this.props.partners
  }
}
