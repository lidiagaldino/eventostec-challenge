import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { User } from "../../../../domain/entities/user.entity";
import { UserPrismaOutput } from "./types/prisma-output.type";
import { Email } from "../../../../domain/value-objects/email.value-object";
import { Password } from "../../../../domain/value-objects/password.value-object";

export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) { }
  async create(user: User): Promise<User> {
    const result = await this.prisma.user.create({
      data: {
        email: user.getEmail().getEmail(),
        password: user.getPassword().getPassword(),
        username: user.getUsername()
      }
    })
    user.setId(result.id)
    return user
  }
  async update(user: User): Promise<User> {
    await this.prisma.user.update({
      where: { id: user.getId() },
      data: {
        email: user.getEmail().getEmail(),
        password: user.getPassword().getPassword(),
        username: user.getUsername()
      }
    })

    return user
  }
  async delete(user: User): Promise<void> {
    await this.prisma.user.delete({
      where: { id: user.getId() }
    })

    return
  }
  async findById(id: string): Promise<User> {
    const result = await this.prisma.user.findUnique({
      where: { id }
    })
    if (!result) return null
    return this.mapOutput(result)
  }

  async findByEmail(email: Email): Promise<User> {
    const result = await this.prisma.user.findUnique({
      where: { email: email.getEmail() }
    })
    if (!result) return null

    return this.mapOutput(result)
  }

  async findByUsername(username: string): Promise<User> {
    const result = await this.prisma.user.findUnique({
      where: { username }
    })
    if (!result) return null
    return this.mapOutput(result)
  }

  async isOwner(user: User): Promise<boolean> {
    const result = await this.prisma.user.findUnique({
      where: {
        id: user.getId(),
        owner: { userId: user.getId() }
      }
    })

    return !!result
  }

  private mapOutput(output: UserPrismaOutput): User {
    const email = Email.create({ email: output.email }).getValue()
    const password = Password.create({ password: output.password }).getValue()
    const user = User.create({ email, password, username: output.username }).getValue()
    user.setId(output.id)
    return user
  }

}
