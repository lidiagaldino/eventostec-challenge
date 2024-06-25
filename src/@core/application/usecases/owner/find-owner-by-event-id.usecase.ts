import { IEventRepository } from "../../../domain/repositories/event.repository";
import { IOwnerRepository } from "../../../domain/repositories/owner.repository";
import { NotFoundException } from "../../../domain/shared/errors/not-found.exception";
import { TOwnerOutputDTO } from "../../dto/owner.dto";
import { mapOwnerOutput } from "./map";

export class FindOwnerByEventIdUsecase {
  constructor(
    private readonly ownerRepository: IOwnerRepository,
    private readonly eventRepository: IEventRepository
  ) { }

  async execute(id: string): Promise<TOwnerOutputDTO> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException('event');
    }

    const owner = await this.ownerRepository.findByEvent(event.getId());
    if (!owner) {
      throw new NotFoundException('owner');
    }
    return mapOwnerOutput(owner);
  }
}
