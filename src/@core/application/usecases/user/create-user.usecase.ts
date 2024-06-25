import { IPasswordCryptography } from "../../../domain/interfaces/password-cryptography.interface";
import { IValidator } from "../../../domain/interfaces/validator.interface";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { UnprocessableException } from "../../../domain/shared/errors/unprocessable.exception";
import { Password } from "../../../domain/value-objects/password.value-object";
import { TUserInputDTO, TUserOutputDTO } from "../../dto/user.dto";
import { userFactory } from "../../factories/user.factory";
import { mapUserOutput } from "./map";

export class CreateUserUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordCryptography: IPasswordCryptography,
    private readonly validator: IValidator<TUserInputDTO>,
    private readonly schema: object
  ) { }

  async execute(dto: TUserInputDTO): Promise<TUserOutputDTO> {
    const { isValid, errorsResult } = this.validator.validate(this.schema, dto)
    if (!isValid) throw new UnprocessableException(errorsResult)

    const user = userFactory(dto)
    if (!user.isRight()) throw new UnprocessableException(user.value.getErrorValue())

    const hashedPassword = await this.passwordCryptography.hash(dto.password)
    const password = Password.create({ password: hashedPassword }).getValue()
    user.value.getValue().setPassword(password)

    const result = await this.userRepository.create(user.value.getValue())
    return mapUserOutput(result)
  }
}
