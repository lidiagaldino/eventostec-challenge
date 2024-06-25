import { Owner } from "../../domain/entities/owner.entity";
import { User } from "../../domain/entities/user.entity";
import { left } from "../../domain/shared/result/left.result";
import { Response } from "../../domain/shared/result/response.result";
import { right } from "../../domain/shared/result/right.result";
import { TOwnerInputDTO } from "../dto/owner.dto";
import { userFactory } from "./user.factory";

export const ownerFactory = (props: { cpf: string, user: User }): Response<Owner> => {
  const owner = Owner.create({
    cpf: props.cpf,
    user: props.user
  })
  if (owner.isFailure) return left(owner)
  return right(owner)
}
