import * as yup from 'yup'
import { TEventInputDTO, TEventPartnerInputDTO } from '../../../../application/dto/event.dto'

export const eventSchema: yup.SchemaOf<TEventInputDTO> = yup.object().shape({
  address: yup.object().shape({
    city: yup.string(),
    uf: yup.string().min(2).max(2)
  }),
  date: yup.date().required(),
  description: yup.string().required().min(2),
  event_url: yup.string().url().required(),
  img_url: yup.string().url().required(),
  remote: yup.bool().required(),
  title: yup.string().required().min(2),
  owner_id: yup.string().uuid().required(),
  partners_id: yup.array().of(yup.string().uuid())
})

export const eventPartnerSchema: yup.SchemaOf<TEventPartnerInputDTO> = yup.object().shape({
  event_id: yup.string().uuid().required(),
  partner_username: yup.string().required()
})
