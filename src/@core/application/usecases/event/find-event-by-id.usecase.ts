import { IEventRepository } from '../../../domain/repositories/event.repository';
import { NotFoundException } from '../../../domain/shared/errors/not-found.exception';
import { TEventOutputDTO } from '../../dto/event.dto';
import { mapEventOutput } from './map';

export class FindEventByIdUsecase {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute(id: string): Promise<TEventOutputDTO> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new NotFoundException('event');
    }

    return mapEventOutput(event);
  }
}
