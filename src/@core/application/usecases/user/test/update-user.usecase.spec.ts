import { NotFoundException } from "../../../../domain/shared/errors/not-found.exception";
import { IValidator } from "../../../../domain/interfaces/validator.interface";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { UnprocessableException } from "../../../../domain/shared/errors/unprocessable.exception";
import { TUpdateUserInputDTO, TUserOutputDTO } from "../../../dto/user.dto";
import { UpdateUserUsecase } from "../update-user.usecase";
import { User } from "../../../../domain/entities/user.entity";
import { Email } from "../../../../domain/value-objects/email.value-object";
import { Password } from "../../../../domain/value-objects/password.value-object";

describe("UpdateUserUsecase", () => {
  let usecase: UpdateUserUsecase;
  let userRepository: IUserRepository;
  let validator: IValidator<TUpdateUserInputDTO>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      isOwner: jest.fn(),
      create: jest.fn(),
    } as jest.Mocked<IUserRepository>;
    validator = { validate: jest.fn() } as jest.Mocked<IValidator<TUpdateUserInputDTO>>;
    usecase = new UpdateUserUsecase(userRepository, validator, {});
  });

  describe("execute", () => {
    it("should throw UnprocessableException when input is invalid", async () => {
      const invalidInput: TUpdateUserInputDTO = { username: "" };
      validator.validate = jest.fn().mockReturnValue({ isValid: false, errorsResult: "Invalid username" });

      await expect(usecase.execute("123", invalidInput)).rejects.toThrow(UnprocessableException);
    });

    it("should throw NotFoundException when user not found", async () => {
      validator.validate = jest.fn().mockReturnValue({ isValid: true });
      userRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(usecase.execute("123", { username: "newUsername" })).rejects.toThrow(NotFoundException);
    });

    it("should update user's username and return updated user", async () => {
      validator.validate = jest.fn().mockReturnValue({ isValid: true });

      const expectedOutput = {
        id: "123",
        username: "newUsername",
        email: "john.doe@example.com",
      }
      const user = User.create({
        email: Email.create({ email: expectedOutput.email }).getValue(),
        password: Password.create({ password: "12345678" }).getValue(),
        username: "John Doe",
      }).getValue();

      user.setId(expectedOutput.id)
      userRepository.findById = jest.fn().mockResolvedValue(user);

      user.setUsername(expectedOutput.username)
      userRepository.update = jest.fn().mockResolvedValue(user);

      const updatedUser: TUserOutputDTO = await usecase.execute("123", { username: "newUsername" });
      expect(updatedUser).toEqual(expectedOutput);
    });
  });
});
