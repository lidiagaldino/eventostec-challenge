import { NotFoundException } from '@nestjs/common';
import { ICouponRepository } from '../../../domain/repositories/coupon.repository';
import { TCouponOutputDTO } from '../../dto/coupon.dto';
import { mapCouponOutput } from './map';

export class FindCouponByCodeUsecase {
  constructor(private readonly couponRepository: ICouponRepository) {}

  async execute(code: string): Promise<TCouponOutputDTO> {
    const coupon = await this.couponRepository.findByCode(code);

    if (!coupon) {
      throw new NotFoundException('coupon');
    }

    return mapCouponOutput(coupon);
  }
}
