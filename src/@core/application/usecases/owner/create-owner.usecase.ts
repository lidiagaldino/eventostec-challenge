import { IValidator } from "../../../domain/interfaces/validator.interface";
import { IOwnerRepository } from "../../../domain/repositories/owner.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { NotFoundException } from "../../../domain/shared/errors/not-found.exception";
import { UnprocessableException } from "../../../domain/shared/errors/unprocessable.exception";
import { TOwnerInputDTO, TOwnerOutputDTO } from "../../dto/owner.dto";
import { ownerFactory } from "../../factories/owner.factory";
import { mapOwnerOutput } from "./map";

export class CreateOwnerUsecase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly ownerRepository: IOwnerRepository,
    private readonly validator: IValidator<TOwnerInputDTO>,
    private readonly schema: object
  ) { }

  async execute(dto: TOwnerInputDTO): Promise<TOwnerOutputDTO> {
    const { isValid, errorsResult } = this.validator.validate(this.schema, dto)
    if (!isValid) throw new UnprocessableException(errorsResult)

    const user = await this.userRepository.findById(dto.user_id)
    if (!user) throw new NotFoundException('user')

    const owner = ownerFactory({ cpf: dto.cpf, user })
    if (!owner.isRight()) throw new UnprocessableException(owner.value.getErrorValue())

    const newOwner = await this.ownerRepository.create(owner.value.getValue())
    return mapOwnerOutput(newOwner)
  }
}
