import { IValidator } from "../../../../domain/interfaces/validator.interface";
import { User } from "../../../../domain/entities/user.entity";
import { Email } from "../../../../domain/value-objects/email.value-object";
import { Password } from "../../../../domain/value-objects/password.value-object";
import { Owner } from "../../../../domain/entities/owner.entity";
import { IOwnerRepository } from "../../../../domain/repositories/owner.repository";
import { UnprocessableException } from "../../../../domain/shared/errors/unprocessable.exception";
import { TUpdateOwnerInputDTO } from "../../../dto/owner.dto";
import { mapOwnerOutput } from "../map";
import { UpdateOwnerUsecase } from "../update-owner.usecase";
import { NotFoundException } from "../../../../domain/shared/errors/not-found.exception";

describe("UpdateOwnerUsecase", () => {
  let usecase: UpdateOwnerUsecase;
  let ownerRepository: IOwnerRepository;
  let validator: IValidator<TUpdateOwnerInputDTO>
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
    ownerRepository = {} as jest.Mocked<IOwnerRepository>;
    validator = {
    } as jest.Mocked<IValidator<TUpdateOwnerInputDTO>>;

    usecase = new UpdateOwnerUsecase(ownerRepository, validator, {} as any);
  });

  describe("execute", () => {
    it("should throw UnprocessableException when input is invalid", async () => {
      const invalidInput: TUpdateOwnerInputDTO = { cpf: "invalid" };
      validator.validate = jest.fn().mockReturnValue({ isValid: false, errorsResult: "Invalid cpf" });

      await expect(usecase.execute("123", invalidInput)).rejects.toThrow(UnprocessableException);
    });

    it("should throw NotFoundException when owner not found", async () => {
      validator.validate = jest.fn().mockReturnValue({
        isValid: true
      });
      ownerRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(usecase.execute("123", {} as any)).rejects.toThrow(NotFoundException);
    });

    it("should update owner's cpf and return the updated owner", async () => {
      validator.validate = jest.fn().mockReturnValue({
        isValid: true
      });
      ownerRepository.findById = jest.fn().mockResolvedValue(owner);
      owner.setCpf('47130399923')
      ownerRepository.update = jest.fn().mockResolvedValue(owner);

      const result = await usecase.execute("123", { cpf: "47130399923" });

      expect(result).toEqual(mapOwnerOutput(owner));
    });
  });
});
