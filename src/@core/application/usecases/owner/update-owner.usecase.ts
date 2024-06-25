import { IValidator } from "../../../domain/interfaces/validator.interface";
import { IOwnerRepository } from "../../../domain/repositories/owner.repository";
import { NotFoundException } from "../../../domain/shared/errors/not-found.exception";
import { UnprocessableException } from "../../../domain/shared/errors/unprocessable.exception";
import { TOwnerOutputDTO, TUpdateOwnerInputDTO } from "../../dto/owner.dto";
import { mapOwnerOutput } from "./map";

export class UpdateOwnerUsecase {
  constructor(
    private readonly ownerRepository: IOwnerRepository,
    private readonly validator: IValidator<TUpdateOwnerInputDTO>,
    private readonly schema: object
  ) { }

  async execute(id: string, dto: TUpdateOwnerInputDTO): Promise<TOwnerOutputDTO> {
    const { isValid, errorsResult } = this.validator.validate(this.schema, dto)
    if (!isValid) throw new UnprocessableException(errorsResult)

    const owner = await this.ownerRepository.findById(id)
    if (!owner) throw new NotFoundException('owner')
    owner.setCpf(dto.cpf)

    const result = await this.ownerRepository.update(owner)
    return mapOwnerOutput(result)
  }
}
