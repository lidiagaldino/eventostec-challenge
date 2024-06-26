import * as yup from 'yup'
import { TSessionInputDTO } from '../../../../application/dto/session.dto'

export const loginSchema: yup.SchemaOf<TSessionInputDTO> = yup.object().shape({
  password: yup.string().required(),
  username: yup.string().required()
})
