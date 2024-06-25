import { User } from "../entities/user.entity";
import { Email } from "../value-objects/email.value-object";

export interface IUserRepository {
  create(user: User): Promise<User>
  update(user: User): Promise<User>
  delete(user: User): Promise<void>
  findById(id: string): Promise<User>
  findByUsername(username: string): Promise<User>
  findByEmail(email: Email): Promise<User>
  isOwner(user: User): Promise<boolean>
}
