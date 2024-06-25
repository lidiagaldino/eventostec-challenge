import { IValidator } from "../../../domain/interfaces/validator.interface";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { NotFoundException } from "../../../domain/shared/errors/not-found.exception";
import { UnprocessableException } from "../../../domain/shared/errors/unprocessable.exception";
import { TUpdateUserInputDTO, TUserOutputDTO } from "../../dto/user.dto";
import { mapUserOutput } from "./map";

export class UpdateUserUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly validator: IValidator<TUpdateUserInputDTO>,
    private readonly schema: object
  ) { }

  async execute(id: string, dto: TUpdateUserInputDTO): Promise<TUserOutputDTO> {
    console.log(dto)
    const { isValid, errorsResult } = this.validator.validate(this.schema, dto)
    if (!isValid) throw new UnprocessableException(errorsResult)

    const user = await this.userRepository.findById(id)
    if (!user) throw new NotFoundException('user')
    user.setUsername(dto.username)

    const updatedUser = await this.userRepository.update(user)
    return mapUserOutput(updatedUser)
  }
}
