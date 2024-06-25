import { IPasswordCryptography } from "../../../domain/interfaces/password-cryptography.interface";
import { IUserCryptography } from "../../../domain/interfaces/user-cryptography.interface";
import { IValidator } from "../../../domain/interfaces/validator.interface";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { UnauthorizedException } from "../../../domain/shared/errors/unauthorized.exception";
import { UnprocessableException } from "../../../domain/shared/errors/unprocessable.exception";
import { TSessionInputDTO, TSessionOutputDTO } from "../../dto/session.dto";
import { mapUserOutput } from "../user/map";

export class SignInUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userCryptography: IUserCryptography,
    private readonly passwordCryptography: IPasswordCryptography,
    private readonly validator: IValidator<TSessionInputDTO>,
    private readonly schema: object
  ) { }

  async execute(dto: TSessionInputDTO): Promise<TSessionOutputDTO> {
    const { isValid, errorsResult } = this.validator.validate(this.schema, dto)
    if (!isValid) throw new UnprocessableException(errorsResult)

    const user = await this.userRepository.findByUsername(dto.username)

    const isPasswordValid = await this.passwordCryptography.compare(
      dto.password,
      user.getPassword().getPassword()
    )

    if (!isPasswordValid) throw new UnauthorizedException()
    const isOwner = await this.userRepository.isOwner(user)

    const token = this.userCryptography.encrypt({
      id: user.getId(),
      username: user.getUsername(),
      type: isOwner ? 'owner' : 'user'
    })
    return { user: mapUserOutput(user), token }
  }
}
