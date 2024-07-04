import { Owner } from "../../../../domain/entities/owner.entity";
import { User } from "../../../../domain/entities/user.entity";
import { IValidator } from "../../../../domain/interfaces/validator.interface";
import { IEventRepository } from "../../../../domain/repositories/event.repository";
import { IOwnerRepository } from "../../../../domain/repositories/owner.repository";
import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { NotFoundException } from "../../../../domain/shared/errors/not-found.exception";
import { UnprocessableException } from "../../../../domain/shared/errors/unprocessable.exception";
import { Email } from "../../../../domain/value-objects/email.value-object";
import { Password } from "../../../../domain/value-objects/password.value-object";
import { Url } from "../../../../domain/value-objects/url.value-object";
import { TEventInputDTO } from "../../../dto/event.dto";
import { CreateEventUsecase } from "../create-event.usecase";
import { Event } from "../../../../domain/entities/event.entity";


describe("CreateEventUsecase", () => {
  let usecase: CreateEventUsecase;
  let eventRepository: IEventRepository;
  let ownerRepository: IOwnerRepository;
  let userRepository: IUserRepository;
  let validator: IValidator<TEventInputDTO>;
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

  const validInput = {
    title: event.getTitle(),
    description: event.getDescription(),
    date: event.getDate(),
    remote: event.getRemote(),
    img_url: event.getImgUrl().getUrl(),
    event_url: event.getEventUrl().getUrl(),
    owner_id: event.getOwner().getId(),
    partners_id: [],
  }

  beforeEach(() => {
    eventRepository = {} as jest.Mocked<IEventRepository>;
    ownerRepository = {} as jest.Mocked<IOwnerRepository>;
    userRepository = {} as jest.Mocked<IUserRepository>;
    validator = {} as jest.Mocked<IValidator<TEventInputDTO>>;

    usecase = new CreateEventUsecase(eventRepository, ownerRepository, userRepository, validator, {});
  });

  it('it should throw Unprocessable Exception when input is invalid', async () => {
    const invalidInput: TEventInputDTO = {
      title: "",
      description: "",
      date: new Date("2024-10-01"),
      remote: true,
      img_url: "",
      event_url: "",
      owner_id: "1",
      partners_id: [],
      address: {
        city: "",
        uf: ""
      }
    }

    validator.validate = jest.fn().mockReturnValue({ isValid: false, errorsResult: "Invalid input" });


    await expect(usecase.execute(invalidInput)).rejects.toThrow(UnprocessableException);
  })

  it('should throw not found exception when the owner is not found', async () => {
    validator.validate = jest.fn().mockReturnValue({ isValid: true });
    ownerRepository.findById = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(validInput)).rejects.toThrow(NotFoundException);

  })

  it('should throw not found exception when the user id of the partner is not found', async () => {
    validInput.partners_id.push("1")
    validator.validate = jest.fn().mockReturnValue({ isValid: true });
    ownerRepository.findById = jest.fn().mockResolvedValue(owner);
    userRepository.findById = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(validInput)).rejects.toThrow(NotFoundException);
  })

  it('should create a new event', async () => {
    validInput.partners_id = []
    validator.validate = jest.fn().mockReturnValue({ isValid: true });
    ownerRepository.findById = jest.fn().mockResolvedValue(owner);
    userRepository.findById = jest.fn().mockResolvedValue(user);
    eventRepository.create = jest.fn().mockResolvedValue(event);

    const result = await usecase.execute(validInput)

    const expectedOutput = {
      id: "1",
      ...validInput,
      address: null,
      partners_id: undefined
    }

    expect(result).toEqual(expectedOutput)
    expect(ownerRepository.findById).toHaveBeenCalledWith(owner.getId())
    expect(validator.validate).toHaveBeenCalledWith(expect.anything(), validInput)
  })
})
