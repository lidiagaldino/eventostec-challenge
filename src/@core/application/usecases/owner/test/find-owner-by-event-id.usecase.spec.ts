import { Event } from "../../../../domain/entities/event.entity";
import { Owner } from "../../../../domain/entities/owner.entity";
import { User } from "../../../../domain/entities/user.entity";
import { IEventRepository } from "../../../../domain/repositories/event.repository";
import { IOwnerRepository } from "../../../../domain/repositories/owner.repository";
import { NotFoundException } from "../../../../domain/shared/errors/not-found.exception";
import { Email } from "../../../../domain/value-objects/email.value-object";
import { Password } from "../../../../domain/value-objects/password.value-object";
import { Url } from "../../../../domain/value-objects/url.value-object";
import { FindOwnerByEventIdUsecase } from "../find-owner-by-event-id.usecase";
import { mapOwnerOutput } from "../map";

describe("FindOwnerByEventIdUsecase", () => {
  let usecase: FindOwnerByEventIdUsecase;
  let eventRepository: IEventRepository;
  let ownerRepository: IOwnerRepository;

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

  beforeEach(() => {
    eventRepository = {} as jest.Mocked<IEventRepository>;
    ownerRepository = {} as jest.Mocked<IOwnerRepository>;
    usecase = new FindOwnerByEventIdUsecase(ownerRepository, eventRepository);
  });

  it("should return owner when event and owner exist", async () => {
    const eventId = "1";
    eventRepository.findById = jest.fn().mockResolvedValue(event);
    ownerRepository.findByEvent = jest.fn().mockResolvedValue(owner);

    const result = await usecase.execute(eventId);
    expect(result).toEqual(mapOwnerOutput(owner));
  });

  it("should throw NotFoundException when event does not exist", async () => {
    const eventId = "1";
    eventRepository.findById = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(eventId)).rejects.toThrow(NotFoundException);
  });

  it("should throw NotFoundException when owner does not exist", async () => {
    const eventId = "1";
    eventRepository.findById = jest.fn().mockResolvedValue(event);
    ownerRepository.findByEvent = jest.fn().mockResolvedValue(null);

    await expect(usecase.execute(eventId)).rejects.toThrow(NotFoundException);
  });
});
