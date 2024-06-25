import { TUserOutputDTO } from "./user.dto"

export type TSessionInputDTO = {
  username: string
  password: string
}

export type TSessionOutputDTO = {
  user: TUserOutputDTO
  token: string
}
