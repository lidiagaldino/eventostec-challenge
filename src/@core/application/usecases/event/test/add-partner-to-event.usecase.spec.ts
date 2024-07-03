import { IValidator } from "../../../../domain/interfaces/validator.interface";
import { IEventRepository } from "../../../../domain/repositories/event.repository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { UnprocessableException } from "../../../../domain/shared/errors/unprocessable.exception";
import { TEventPartnerInputDTO } from "../../../dto/event.dto";
import { AddPartnerToEventUsecase } from "../add-partner-to-event.usecase";
import { User } from "../../../../domain/entities/user.entity";
import { Email } from "../../../../domain/value-objects/email.value-object";
import { Password } from "../../../../domain/value-objects/password.value-object";
import { Owner } from "../../../../domain/entities/owner.entity";
import { Url } from "../../../../domain/value-objects/url.value-object";
import { Event } from "../../../../domain/entities/event.entity";
import { NotFoundException } from "../../../../domain/shared/errors/not-found.exception";
import { BadRequestException } from "../../../../domain/shared/errors/bad-request.exception";

describe("AddPartnerToEventUsecase", () => {
  let usecase: AddPartnerToEventUsecase;
  let eventRepository: IEventRepository;
  let userRepository: IUserRepository;
  let validator: IValidator<TEventPartnerInputDTO>;
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
  const event = Event.create({
    date: new Date("2024-10-01"),
    description: "event description",
    event_url: Url.create({ url: "http://event.com" }).getValue(),
    img_url: Url.create({ url: "http://img.event.com" }).getValue(),
    owner,
    remote: true,
    title: "Event 1"
  }).getValue()
  event.setId("1")

  beforeEach(() => {
    eventRepository = {} as jest.Mocked<IEventRepository>;
    userRepository = {} as jest.Mocked<IUserRepository>;
    validator = {
    } as jest.Mocked<IValidator<TEventPartnerInputDTO>>;

    usecase = new AddPartnerToEventUsecase(eventRepository, userRepository, validator, {});
  });

  describe("execute", () => {
    it("should throw UnprocessableException when input is invalid", async () => {
      const invalidInput: TEventPartnerInputDTO = { partner_username: "invalid", event_id: "invalid" };
      validator.validate = jest.fn().mockReturnValue({ isValid: false, errorsResult: "Invalid input" });

      await expect(usecase.execute(invalidInput)).rejects.toThrow(UnprocessableException);
    });

    it("should throw NotFoundException when user not found", async () => {
      const validInput: TEventPartnerInputDTO = { partner_username: "valid", event_id: "valid" };
      validator.validate = jest.fn().mockReturnValue({ isValid: true });
      userRepository.findByUsername = jest.fn().mockResolvedValue(null);

      await expect(usecase.execute(validInput)).rejects.toThrow(NotFoundException);
    });

    it("should throw NotFoundException when event not found", async () => {
      const validInput: TEventPartnerInputDTO = { partner_username: "valid", event_id: "1" };
      validator.validate = jest.fn().mockReturnValue({ isValid: true });
      userRepository.findByUsername = jest.fn().mockResolvedValue(user);
      eventRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(usecase.execute(validInput)).rejects.toThrow(NotFoundException);
    });

    it("should throw BadRequestException when partner already exists", async () => {
      const validInput: TEventPartnerInputDTO = { partner_username: "valid", event_id: "valid" };
      validator.validate = jest.fn().mockReturnValue({ isValid: true });
      userRepository.findByUsername = jest.fn().mockResolvedValue(user);
      eventRepository.findById = jest.fn().mockResolvedValue(event);
      eventRepository.verifyIfPartnerExists = jest.fn().mockResolvedValue(true);

      await expect(usecase.execute(validInput)).rejects.toThrow(BadRequestException);
    });

    it("should add partner to event successfully", async () => {
      const validInput: TEventPartnerInputDTO = { partner_username: "valid", event_id: "1" };
      validator.validate = jest.fn().mockReturnValue({ isValid: true });
      userRepository.findByUsername = jest.fn().mockResolvedValue(user);
      eventRepository.findById = jest.fn().mockResolvedValue(event);
      eventRepository.verifyIfPartnerExists = jest.fn().mockResolvedValue(false);
      eventRepository.addPartner = jest.fn().mockResolvedValue(null);

      await usecase.execute(validInput);
      expect(eventRepository.addPartner).toHaveBeenCalledWith(event, user);
    });
  });
});
