import { randomUUID } from "crypto";
import { IPasswordCryptography } from "../../../../domain/interfaces/password-cryptography.interface";
import { IValidator } from "../../../../domain/interfaces/validator.interface";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { Password } from "../../../../domain/value-objects/password.value-object";
import { TUserInputDTO, TUserOutputDTO } from "../../../dto/user.dto";
import { userFactory } from "../../../factories/user.factory";
import { CreateUserUsecase } from "../create-user.usecase";
import { UnprocessableException } from "../../../../domain/shared/errors/unprocessable.exception";

describe("CreateUserUsecase", () => {
  let useCase: CreateUserUsecase;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordCryptography: jest.Mocked<IPasswordCryptography>;
  let validator: jest.Mocked<IValidator<TUserInputDTO>>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      isOwner: jest.fn(),
    } as jest.Mocked<IUserRepository>;
    passwordCryptography = {
      compare: jest.fn(),
      hash: jest.fn(),
    } as jest.Mocked<IPasswordCryptography>;
    validator = {
      validate: jest.fn(),
    } as jest.Mocked<IValidator<TUserInputDTO>>;
    useCase = new CreateUserUsecase(userRepository, passwordCryptography, validator, {});
  });

  it("should correctly map the created user to the output DTO", async () => {
    const input: TUserInputDTO = {
      email: 'lidia@gmail.com',
      password: 'password',
      username: 'Lidia',
    };
    const id = randomUUID()

    const expectedOutput: TUserOutputDTO = {
      id,
      email: 'lidia@gmail.com',
      username: 'Lidia',
    };

    const hashedPassword = "hashedPassword";
    passwordCryptography.hash = jest.fn().mockResolvedValue(hashedPassword);

    validator.validate = jest.fn().mockReturnValue({ isValid: true })

    const user = userFactory(input);
    user.value.getValue().setPassword(Password.create({ password: hashedPassword }).getValue());

    const newUser = userFactory(input).value.getValue()
    newUser.setId(id)
    userRepository.create = jest.fn().mockResolvedValue(newUser)

    const result = await useCase.execute(input);

    expect(result).toEqual(expectedOutput);
    expect(userRepository.create).toHaveBeenCalledWith(user.value.getValue());
    expect(passwordCryptography.hash).toHaveBeenCalledWith(input.password);
    expect(passwordCryptography.hash).toHaveBeenCalledTimes(1);
  });

  it('should throw an unprocessable exception when input is invalid', async () => {
    const input: TUserInputDTO = {
      email: 'invalid',
      password: 'invalid',
      username: 'invalid',
    };

    validator.validate = jest.fn().mockReturnValue({ isValid: false, errosResult: 'invalid body' })
    await expect(useCase.execute(input)).rejects.toThrow(UnprocessableException)
  })

  it('should throw an unprocessable exception when user entity creation fails', async () => {
    const input: TUserInputDTO = {
      email: 'invalid',
      password: 'invalid',
      username: 'invalid',
    };

    validator.validate = jest.fn().mockReturnValue({ isValid: true })
    await expect(useCase.execute(input)).rejects.toThrow(UnprocessableException)
  })
});
