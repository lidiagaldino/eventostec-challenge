import { PrismaClient } from "@prisma/client";
import { IOwnerRepository } from "../../../../domain/repositories/owner.repository";
import { Owner } from "../../../../domain/entities/owner.entity";
import { OwnerPrismaOutput } from "./types/prisma-output.type";
import { Email } from "../../../../domain/value-objects/email.value-object";
import { User } from "../../../../domain/entities/user.entity";
import { Password } from "../../../../domain/value-objects/password.value-object";

export class OwnerPrismaRepository implements IOwnerRepository {
  constructor(private readonly prisma: PrismaClient) { }
  async create(owner: Owner): Promise<Owner> {
    const result = await this.prisma.owner.create({
      data: {
        cpf: owner.getCpf(),
        user: { connect: { id: owner.getUser().getId() } }
      }
    })

    owner.setId(result.id)
    return owner
  }
  async update(owner: Owner): Promise<Owner> {
    await this.prisma.owner.update({
      where: { id: owner.getId() },
      data: { cpf: owner.getCpf() }
    })
    return owner
  }
  async disable(owner: Owner): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async findById(id: string): Promise<Owner> {
    const result = await this.prisma.owner.findUnique({
      where: { id },
      include: { user: true }
    })
    console.log(result)
    if (!result) return null
    return this.mapOutput(result)
  }
  async findByEvent(eventId: string): Promise<Owner> {
    const result = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { owner: { include: { user: true } } }
    })
    if (!result) return null
    return this.mapOutput(result.owner)
  }

  private mapOutput(output: OwnerPrismaOutput): Owner {
    const email = Email.create({ email: output.user.email }).getValue()
    const password = Password.create({ password: output.user.password }).getValue()
    const user = User.create({ email, password, username: output.user.username }).getValue()
    user.setId(output.id)

    const owner = Owner.create({ user, cpf: output.cpf }).getValue()
    owner.setId(output.id)
    return owner
  }
}
