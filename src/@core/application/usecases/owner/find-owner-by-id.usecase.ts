import { IOwnerRepository } from "../../../domain/repositories/owner.repository"
import { NotFoundException } from "../../../domain/shared/errors/not-found.exception"
import { TOwnerOutputDTO } from "../../dto/owner.dto"
import { mapOwnerOutput } from "./map"

export class FindOwnerByIdUsecase {
  constructor(
    private readonly ownerRepository: IOwnerRepository
  ) { }

  async execute(id: string): Promise<TOwnerOutputDTO> {
    const owner = await this.ownerRepository.findById(id)
    if (!owner) throw new NotFoundException('owner')

    return mapOwnerOutput(owner)
  }
}
