import { User } from '../../../domain/entities/user.entity';
import { IValidator } from '../../../domain/interfaces/validator.interface';
import { IEventRepository } from '../../../domain/repositories/event.repository';
import { IOwnerRepository } from '../../../domain/repositories/owner.repository';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { NotFoundException } from '../../../domain/shared/errors/not-found.exception';
import { UnprocessableException } from '../../../domain/shared/errors/unprocessable.exception';
import { TEventInputDTO, TEventOutputDTO } from '../../dto/event.dto';
import { eventFactory } from '../../factories/event.factory';
import { mapEventOutput } from './map';

export class UpdateEventUsecase {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly ownerRepository: IOwnerRepository,
    private readonly userRepository: IUserRepository,
    private readonly validator: IValidator<TEventInputDTO>,
    private readonly schama: Object,
  ) { }

  async execute(id: string, dto: TEventInputDTO): Promise<TEventOutputDTO> {
    const { isValid, errorsResult } = this.validator.validate(this.schama, dto);
    if (!isValid) {
      throw new UnprocessableException(errorsResult);
    }

    const event = await this.eventRepository.findById(id);
    if (!event) throw new NotFoundException('event');

    const owner = await this.ownerRepository.findById(dto.owner_id)
    if (!owner) throw new NotFoundException('owner')

    let partners: User[] = null
    if (dto.partners_id) {
      partners = await Promise.all(dto.partners_id.map((id) => this.userRepository.findById(id)))
      if (partners.filter(partner => !partner)?.length > 0) throw new NotFoundException('partners')
    }

    const eventEntity = eventFactory({
      date: dto.date,
      description: dto.description,
      event_url: dto.event_url,
      img_url: dto.img_url,
      owner,
      partners,
      remote: dto.remote,
      title: dto.title,
      address: dto?.address
    });
    if (!eventEntity.isRight()) throw new UnprocessableException(errorsResult);
    eventEntity.value.getValue().setId(event.getId())

    const result = await this.eventRepository.update(eventEntity.value.getValue());
    return mapEventOutput(result);
  }
}
