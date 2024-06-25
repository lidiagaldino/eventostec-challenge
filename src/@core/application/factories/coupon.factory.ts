import { Coupon } from '../../domain/entities/coupon.entity';
import { Response } from '../../domain/shared/result/response.result';
import { Event } from '../../domain/entities/event.entity';
import { right } from '../../domain/shared/result/right.result';
import { left } from '../../domain/shared/result/left.result';

type TCouponFactoryInput = {
  code: string;
  discount: number;
  event: Event;
  valid: boolean;
};

export const couponFactory = (
  coupon: TCouponFactoryInput,
): Response<Coupon> => {
  const result = Coupon.create({
    code: coupon.code,
    discount: coupon.discount,
    event: coupon.event,
    valid: coupon.valid,
  });
  if (result.isFailure) return left(result);

  return right(result);
};
