import { Owner } from "../../../../domain/entities/owner.entity"
import { User } from "../../../../domain/entities/user.entity"
import { IOwnerRepository } from "../../../../domain/repositories/owner.repository"
import { NotFoundException } from "../../../../domain/shared/errors/not-found.exception"
import { Email } from "../../../../domain/value-objects/email.value-object"
import { Password } from "../../../../domain/value-objects/password.value-object"
import { TOwnerOutputDTO } from "../../../dto/owner.dto"
import { FindOwnerByIdUsecase } from "../find-owner-by-id.usecase"

describe('FindOwnerByIdUsecase', () => {
  let ownerRepository: IOwnerRepository
  let findOwnerByIdUsecase: FindOwnerByIdUsecase
  const user = User.create({
    email: Email.create({ email: 'john@example.com' }).getValue(),
    password: Password.create({ password: "12345678" }).getValue(),
    username: "John Doe",
  }).getValue();
  user.setId("123")
  const owner = Owner.create({
    cpf: "45078224084",
    user
  }).getValue();
  owner.setId("123")

  beforeEach(() => {
    ownerRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      isOwner: jest.fn(),
      create: jest.fn(),
      disable: jest.fn(),
      findByEvent: jest.fn(),
    } as jest.Mocked<IOwnerRepository>
    findOwnerByIdUsecase = new FindOwnerByIdUsecase(ownerRepository)
  })

  test('should throw NotFoundException when owner is not found', async () => {
    ownerRepository.findById = jest.fn().mockResolvedValue(null)

    await expect(findOwnerByIdUsecase.execute('123')).rejects.toThrow(NotFoundException)
  })

  test('should return owner output when owner is found', async () => {
    const expectedOutput: TOwnerOutputDTO = {
      id: '123',
      user_id: '123',
      cpf: owner.getCpf(),
    }

    ownerRepository.findById = jest.fn().mockResolvedValue(owner)

    const actualOutput = await findOwnerByIdUsecase.execute('123')
    expect(actualOutput).toEqual(expectedOutput)
    expect(ownerRepository.findById).toHaveBeenCalledWith('123')
    expect(ownerRepository.findById).toHaveBeenCalledTimes(1)
  })
})
