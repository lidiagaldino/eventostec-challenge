import { Filtering } from '../../../domain/interfaces/filtering.interface';
import { Pagination, PaginatedResource } from '../../../domain/interfaces/pagination.interface';
import { IEventRepository } from '../../../domain/repositories/event.repository';
import { NotFoundException } from '../../../domain/shared/errors/not-found.exception';
import { TEventOutputDTO } from '../../dto/event.dto';
import { mapEventOutput } from './map';

export class FindAllEventsUsecase {
  constructor(private readonly eventRepository: IEventRepository) { }

  async execute(
    pagination: Pagination,
    filtering: Filtering[]
  ): Promise<PaginatedResource<TEventOutputDTO>> {
    console.log(filtering)
    const events = await this.eventRepository.findAll(pagination, filtering);
    if (!events) throw new NotFoundException('events');

    const mappedEvents = events.items.map(mapEventOutput);
    return { ...events, items: mappedEvents }
  }
}
