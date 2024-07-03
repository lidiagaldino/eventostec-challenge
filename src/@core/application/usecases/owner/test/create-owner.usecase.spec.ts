import { NotFoundException } from "../../../../domain/shared/errors/not-found.exception";
import { Owner } from "../../../../domain/entities/owner.entity";
import { User } from "../../../../domain/entities/user.entity";
import { IValidator } from "../../../../domain/interfaces/validator.interface";
import { IOwnerRepository } from "../../../../domain/repositories/owner.repository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { UnprocessableException } from "../../../../domain/shared/errors/unprocessable.exception";
import { TOwnerInputDTO, TOwnerOutputDTO } from "../../../dto/owner.dto";
import { CreateOwnerUsecase } from "../create-owner.usecase";
import { Email } from "../../../../domain/value-objects/email.value-object";
import { Password } from "../../../../domain/value-objects/password.value-object";

describe("CreateOwnerUsecase", () => {
  let usecase: CreateOwnerUsecase;
  let ownerRepository: IOwnerRepository;
  let userRepository: IUserRepository;
  let validator: IValidator<TOwnerInputDTO>;
  const user = User.create({
    email: Email.create({ email: 'john@example.com' }).getValue(),
    password: Password.create({ password: "12345678" }).getValue(),
    username: "John Doe",
  }).getValue();
  user.setId("1")
  const owner = Owner.create({
    cpf: "45078224084",
    user
  }).getValue();
  owner.setId("1")

  beforeEach(() => {
    ownerRepository = {
      create: jest.fn(),
      update: jest.fn(),
      disable: jest.fn(),
      findById: jest.fn(),
      findByEvent: jest.fn(),
    } as jest.Mocked<IOwnerRepository>;

    userRepository = {
      findByUsername: jest.fn(),
      isOwner: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    validator = {
      validate: jest.fn(),
    } as jest.Mocked<IValidator<TOwnerInputDTO>>;

    usecase = new CreateOwnerUsecase(userRepository, ownerRepository, validator, {});
  });

  it("should throw an UnprocessableException when input is invalid", async () => {
    const invalidInput: TOwnerInputDTO = {
      user_id: "invalid",
      cpf: "invalid",
    };

    validator.validate = jest.fn().mockReturnValue({ isValid: false, errorsResult: "Invalid input" });

    await expect(usecase.execute(invalidInput)).rejects.toThrow(UnprocessableException);
  });

  it("should throw a NotFoundException when user is not found", async () => {
    const invalidUserId: string = "invalid";

    validator.validate = jest.fn().mockReturnValue({ isValid: true });
    userRepository.findById = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute({ user_id: invalidUserId, cpf: "valid" })).rejects.toThrow(NotFoundException);
  });

  it("should throw an UnprocessableException when owner entity creation fails", async () => {
    validator.validate = jest.fn().mockReturnValue({ isValid: true });
    userRepository.findById = jest.fn().mockResolvedValue(user);
    await expect(usecase.execute({ user_id: "1", cpf: null })).rejects.toThrow(UnprocessableException);
  });

  it("should return a valid owner output when everything succeeds", async () => {
    validator.validate = jest.fn().mockReturnValue({ isValid: true });
    userRepository.findById = jest.fn().mockResolvedValue(user);
    ownerRepository.create = jest.fn().mockResolvedValue(owner);

    const expectedOutput: TOwnerOutputDTO = {
      id: "1",
      user_id: "1",
      cpf: "45078224084",
    };

    const input: TOwnerInputDTO = {
      user_id: "1",
      cpf: "45078224084",
    };

    const output = await usecase.execute(input);

    expect(output).toEqual(expectedOutput);
  });
});
