import * as yup from 'yup'
import { TUpdateUserInputDTO, TUserInputDTO } from '../../../../application/dto/user.dto'

export const userSchema: yup.SchemaOf<TUserInputDTO> = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
  username: yup.string().required()
})

export const updateUserSchema: yup.SchemaOf<TUpdateUserInputDTO> = yup.object().shape({
  username: yup.string().required()
})
