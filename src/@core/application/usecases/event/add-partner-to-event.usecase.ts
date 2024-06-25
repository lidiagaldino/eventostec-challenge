import { IValidator } from "../../../domain/interfaces/validator.interface";
import { IEventRepository } from "../../../domain/repositories/event.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { BadRequestException } from "../../../domain/shared/errors/bad-request.exception";
import { NotFoundException } from "../../../domain/shared/errors/not-found.exception";
import { UnprocessableException } from "../../../domain/shared/errors/unprocessable.exception";
import { TEventPartnerInputDTO } from "../../dto/event.dto";

export class AddPartnerToEventUsecase {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly userRepository: IUserRepository,
    private readonly validator: IValidator<TEventPartnerInputDTO>,
    private readonly schema: object
  ) { }

  async execute(dto: TEventPartnerInputDTO): Promise<void> {
    const { isValid, errorsResult } = this.validator.validate(this.schema, dto)
    if (!isValid) throw new UnprocessableException(errorsResult)

    const user = await this.userRepository.findByUsername(dto.partner_username)
    if (!user) throw new NotFoundException('user')

    const event = await this.eventRepository.findById(dto.event_id)
    if (!event) throw new NotFoundException('event')

    const eventPartner = await this.eventRepository.verifyIfPartnerExists(event, user)
    if (eventPartner) throw new BadRequestException('this user is already a partner of this event')

    await this.eventRepository.addPartner(event, user)
    return
  }
}
