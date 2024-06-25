import { Coupon } from '../../../domain/entities/coupon.entity';
import { TCouponOutputDTO } from '../../dto/coupon.dto';

export const mapCouponOutput = (coupon: Coupon): TCouponOutputDTO => {
  return {
    code: coupon.getCode(),
    discount: coupon.getDiscount(),
    event_id: coupon.getEvent().getId(),
    id: coupon.getId(),
    valid: coupon.getValid(),
  };
};
