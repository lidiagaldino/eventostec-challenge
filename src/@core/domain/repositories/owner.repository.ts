import { Owner } from "../entities/owner.entity";

export interface IOwnerRepository {
  create(owner: Owner): Promise<Owner>
  update(owner: Owner): Promise<Owner>
  disable(owner: Owner): Promise<void>
  findById(id: string): Promise<Owner>
  findByEvent(eventId: string): Promise<Owner>
}
