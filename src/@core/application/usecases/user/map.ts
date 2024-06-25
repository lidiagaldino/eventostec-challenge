import { User } from "../../../domain/entities/user.entity";
import { TUserOutputDTO } from "../../dto/user.dto";

export const mapUserOutput = (user: User): TUserOutputDTO => {
  return {
    id: user.getId(),
    email: user.getEmail().getEmail(),
    username: user.getUsername()
  }
}
