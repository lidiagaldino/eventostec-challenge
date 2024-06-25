import { Coupon } from '../entities/coupon.entity';

export interface ICouponRepository {
  findById(id: string): Promise<Coupon>;
  create(coupon: Coupon): Promise<Coupon>;
  update(coupon: Coupon): Promise<Coupon>;
  delete(coupon: Coupon): Promise<void>;
  findAll(): Promise<Coupon[]>;
  findByCode(code: string): Promise<Coupon>;
  findByEventId(eventId: string): Promise<Coupon[]>;
}
