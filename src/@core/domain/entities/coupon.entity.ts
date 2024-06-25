import { Event } from './event.entity';
import { Result } from '../shared/result/result';
import { Guard } from '../shared/guard/guard';

export type TCouponProps = {
  discount: number;
  code: string;
  valid: boolean;
  event: Event;
};

export class Coupon {
  private id: string;
  private props: TCouponProps;

  private constructor(props: TCouponProps) {
    this.props = props;
  }

  public static create(coupon: TCouponProps): Result<Coupon> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(coupon.discount, 'discount'),
      Guard.againstNullOrUndefined(coupon.code, 'code'),
      Guard.againstNullOrUndefined(coupon.valid, 'valid'),
      Guard.againstNullOrUndefined(coupon.event, 'event'),
      Guard.greaterThan(0, coupon.discount),
      Guard.againstAtLeast(5, coupon.code),
    ]);

    if (guardResult.isFailure) {
      return Result.fail<Coupon>(guardResult.getErrorValue());
    }

    return Result.ok<Coupon>(new Coupon(coupon));
  }

  public setId(id: string) {
    this.id = id
  }

  public getId() {
    return this.id;
  }
  public getDiscount() {
    return this.props.discount;
  }
  public getCode() {
    return this.props.code;
  }
  public getValid() {
    return this.props.valid;
  }
  public getEvent() {
    return this.props.event;
  }
}
