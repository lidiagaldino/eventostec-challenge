import { IUserCryptography } from '../../../domain/interfaces/user-cryptography.interface';
import { IValidator } from '../../../domain/interfaces/validator.interface';
import { ICouponRepository } from '../../../domain/repositories/coupon.repository';
import { IEventRepository } from '../../../domain/repositories/event.repository';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { UnauthorizedException } from '../../../domain/shared/errors/unauthorized.exception';
import { UnprocessableException } from '../../../domain/shared/errors/unprocessable.exception';
import { TCouponInputDTO, TCouponOutputDTO } from '../../dto/coupon.dto';
import { couponFactory } from '../../factories/coupon.factory';
import { mapCouponOutput } from './map';

export class CreateCouponUsecase {
  constructor(
    private readonly couponRepository: ICouponRepository,
    private readonly eventRepository: IEventRepository,
    private readonly userRepository: IUserRepository,
    private readonly userCryptography: IUserCryptography,
    private readonly validator: IValidator<TCouponInputDTO>,
    private readonly schema: Object,
  ) { }

  async execute(dto: TCouponInputDTO, token: string): Promise<TCouponOutputDTO> {
    const { isValid, errorsResult } = this.validator.validate(this.schema, dto);

    if (!isValid) {
      throw new UnprocessableException(errorsResult);
    }

    const userPayload = this.userCryptography.verify(token)
    const user = await this.userRepository.findById(userPayload.id)
    const event = await this.eventRepository.findById(dto.event_id);
    const isUserAPartner = await this.eventRepository.verifyIfPartnerExists(event, user)
    if (!isUserAPartner) throw new UnauthorizedException()

    const couponEntity = couponFactory({ ...dto, event, valid: true });
    if (!couponEntity.isRight()) {
      throw new UnprocessableException(couponEntity.value.getErrorValue());
    }

    const coupon = await this.couponRepository.create(
      couponEntity.value.getValue(),
    );

    return mapCouponOutput(coupon);
  }
}
