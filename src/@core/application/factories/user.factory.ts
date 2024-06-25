import { User } from "../../domain/entities/user.entity";
import { left } from "../../domain/shared/result/left.result";
import { Response } from "../../domain/shared/result/response.result";
import { right } from "../../domain/shared/result/right.result";
import { Email } from "../../domain/value-objects/email.value-object";
import { Password } from "../../domain/value-objects/password.value-object";
import { TUserInputDTO } from "../dto/user.dto";

export const userFactory = (input: TUserInputDTO): Response<User> => {
  const email = Email.create({ email: input.email })
  if (email.isFailure) return left(email)

  const password = Password.create({ password: input.password })
  if (password.isFailure) return left(password)

  const user = User.create({
    username: input.username,
    email: email.getValue(),
    password: password.getValue()
  })
  if (user.isFailure) return left(user)
  return right(user)
}
