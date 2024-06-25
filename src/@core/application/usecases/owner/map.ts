import { Owner } from "../../../domain/entities/owner.entity";
import { TOwnerOutputDTO } from "../../dto/owner.dto";
import { mapUserOutput } from "../user/map";

export const mapOwnerOutput = (owner: Owner): TOwnerOutputDTO => {
  return {
    id: owner.getId(),
    user_id: owner.getUser().getId(),
    cpf: owner.getCpf(),
  };
}
