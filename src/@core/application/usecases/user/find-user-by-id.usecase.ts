import { IUserRepository } from "../../../domain/repositories/user.repository";
import { NotFoundException } from "../../../domain/shared/errors/not-found.exception";
import { TUserOutputDTO } from "../../dto/user.dto";
import { mapUserOutput } from "./map";

export class FindUserByIdUsecase {
  constructor(private readonly userRepository: IUserRepository) { }

  async execute(id: string): Promise<TUserOutputDTO> {
    const user = await this.userRepository.findById(id)
    if (!user) throw new NotFoundException('user')

    return mapUserOutput(user)
  }
}
