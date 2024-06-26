import * as yup from 'yup'
import { TOwnerInputDTO, TUpdateOwnerInputDTO } from '../../../../application/dto/owner.dto'

export const ownerSchema: yup.SchemaOf<TOwnerInputDTO> = yup.object().shape({
  cpf: yup.string().required(),
  user_id: yup.string().uuid().required()
})

export const updateOwnerSchema: yup.SchemaOf<TUpdateOwnerInputDTO> = yup.object().shape({
  cpf: yup.string().required(),
})
