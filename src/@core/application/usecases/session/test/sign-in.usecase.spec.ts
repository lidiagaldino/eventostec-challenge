import { UnauthorizedException } from "../../../../domain/shared/errors/unauthorized.exception";
import { IPasswordCryptography } from "../../../../domain/interfaces/password-cryptography.interface";
import { IUserCryptography } from "../../../../domain/interfaces/user-cryptography.interface";
import { IValidator } from "../../../../domain/interfaces/validator.interface";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { UnprocessableException } from "../../../../domain/shared/errors/unprocessable.exception";
import { TSessionInputDTO } from "../../../dto/session.dto";
import { SignInUsecase } from "../sign-in.usecase";
import { User } from "../../../../domain/entities/user.entity";
import { Email } from "../../../../domain/value-objects/email.value-object";
import { Password } from "../../../../domain/value-objects/password.value-object";

describe("SignInUsecase", () => {
  let usecase: SignInUsecase;
  let userRepository: IUserRepository;
  let userCryptography: IUserCryptography;
  let passwordCryptography: IPasswordCryptography;
  let validator: IValidator<TSessionInputDTO>;
  const user = User.create({
    email: Email.create({ email: 'john@example.com' }).getValue(),
    password: Password.create({ password: "12345678" }).getValue(),
    username: "John Doe",
  }).getValue();
  user.setId("1")

  beforeEach(() => {
    userRepository = {
      findByUsername: jest.fn(),
      isOwner: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    } as jest.Mocked<IUserRepository>;
    userCryptography = {
      encrypt: jest.fn(),
      isOwner: jest.fn(),
      verify: jest.fn(),
    } as jest.Mocked<IUserCryptography>;
    passwordCryptography = {
      compare: jest.fn(),
      hash: jest.fn(),
    } as jest.Mocked<IPasswordCryptography>;
    validator = {
      validate: jest.fn(),
    } as jest.Mocked<IValidator<TSessionInputDTO>>;
    usecase = new SignInUsecase(
      userRepository,
      userCryptography,
      passwordCryptography,
      validator,
      {}
    );
  });

  it("should throw UnprocessableException when input is invalid", async () => {
    const invalidInput: TSessionInputDTO = { username: "invalid", password: "invalid" };
    validator.validate = jest.fn().mockReturnValue({ isValid: false, errorsResult: "Invalid input" });

    await expect(usecase.execute(invalidInput)).rejects.toThrow(UnprocessableException);
  });

  it("should throw UnauthorizedException when password is incorrect", async () => {
    validator.validate = jest.fn().mockReturnValue({ isValid: true });
    userRepository.findByUsername = jest.fn().mockResolvedValue(user);
    passwordCryptography.compare = jest.fn().mockResolvedValue(false);

    await expect(usecase.execute({ username: "user", password: "wrong" })).rejects.toThrow(UnauthorizedException);
  });

  it("should return token when input is valid and password is correct", async () => {
    validator.validate = jest.fn().mockReturnValue({ isValid: true });
    userRepository.findByUsername = jest.fn().mockResolvedValue(user);
    passwordCryptography.compare = jest.fn().mockResolvedValue(true);
    userRepository.isOwner = jest.fn().mockResolvedValue(false);
    userCryptography.encrypt = jest.fn().mockReturnValue("token");

    const result = await usecase.execute({ username: "John Doe", password: "12345678" });

    expect(result).toEqual({
      user: {
        id: "1",
        username: "John Doe",
        email: "john@example.com",
      },
      token: expect.any(String),
    });
  });
});
