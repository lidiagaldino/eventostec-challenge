export type TOwnerInputDTO = {
  user_id: string
  cpf: string
}

export type TUpdateOwnerInputDTO = {
  cpf: string
}

export type TOwnerOutputDTO = {
  id: string
  user_id: string,
  cpf: string
}
