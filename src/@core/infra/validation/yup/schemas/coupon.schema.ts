import * as yup from 'yup'
import { TCouponInputDTO } from '../../../../application/dto/coupon.dto'

export const couponSchema: yup.SchemaOf<TCouponInputDTO> = yup.object().shape({
  code: yup.string().min(5).required(),
  discount: yup.number().positive().required(),
  event_id: yup.string().uuid().required(),
})
