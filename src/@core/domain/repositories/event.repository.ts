import { Event } from '../entities/event.entity';
import { User } from '../entities/user.entity';
import { Filtering } from '../interfaces/filtering.interface';
import { Pagination, PaginatedResource } from '../interfaces/pagination.interface';

export interface IEventRepository {
  findById(id: string): Promise<Event>;
  create(event: Event): Promise<Event>;
  update(event: Event): Promise<Event>;
  delete(event: Event): Promise<void>;
  findAll(
    pagination: Pagination,
    filtering: Filtering[],
  ): Promise<PaginatedResource<Event>>;
  addPartner(event: Event, user: User): Promise<void>
  removePartner(event: Event, user: User): Promise<void>
  verifyIfPartnerExists(event: Event, user: User): Promise<boolean>
}
