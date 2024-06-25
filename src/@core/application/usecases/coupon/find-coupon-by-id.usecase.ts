import { NotFoundException } from '@nestjs/common';
import { ICouponRepository } from '../../../domain/repositories/coupon.repository';
import { TCouponOutputDTO } from '../../dto/coupon.dto';
import { mapCouponOutput } from './map';

export class FindCouponByIdUsecase {
  constructor(private readonly couponRepository: ICouponRepository) {}

  async execute(id: string): Promise<TCouponOutputDTO> {
    const coupon = await this.couponRepository.findById(id);

    if (!coupon) {
      throw new NotFoundException('coupon');
    }

    return mapCouponOutput(coupon);
  }
}
