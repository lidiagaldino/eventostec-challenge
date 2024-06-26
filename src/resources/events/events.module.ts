import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { YupAdapter } from '../../@core/infra/validation/yup/yup.adapter';
import { EventPrismaRepository } from '../../@core/infra/db/prisma/repositories/event.prisma-repository';
import { prismaClient } from '../../@core/infra/db/prisma';
import { CreateEventUsecase } from '../../@core/application/usecases/event/create-event.usecase';
import { IEventRepository } from '../../@core/domain/repositories/event.repository';
import { IValidator } from '../../@core/domain/interfaces/validator.interface';
import { TEventInputDTO, TEventPartnerInputDTO } from '../../@core/application/dto/event.dto';
import { eventPartnerSchema, eventSchema } from '../../@core/infra/validation/yup/schemas/event.schema';
import { UpdateEventUsecase } from '../../@core/application/usecases/event/update-event.usecase';
import { FindAllEventsUsecase } from '../../@core/application/usecases/event/find-all-events.usecase';
import { FindEventByIdUsecase } from '../../@core/application/usecases/event/find-event-by-id.usecase';
import { UserPrismaRepository } from '../../@core/infra/db/prisma/repositories/user.prisma-repository';
import { OwnerPrismaRepository } from '../../@core/infra/db/prisma/repositories/owner.prisma-repository';
import { IUserRepository } from '../../@core/domain/repositories/user.repository';
import { IOwnerRepository } from '../../@core/domain/repositories/owner.repository';
import { AddPartnerToEventUsecase } from '../../@core/application/usecases/event/add-partner-to-event.usecase';
import { RemoveEventPartnerUsecase } from '../../@core/application/usecases/event/remove-event-partner.usecase';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [EventsController],
  providers: [
    JwtService,
    { provide: YupAdapter, useClass: YupAdapter },
    { provide: EventPrismaRepository, useFactory: () => new EventPrismaRepository(prismaClient) },
    { provide: UserPrismaRepository, useFactory: () => new UserPrismaRepository(prismaClient) },
    { provide: OwnerPrismaRepository, useFactory: () => new OwnerPrismaRepository(prismaClient) },
    {
      provide: CreateEventUsecase,
      useFactory: (
        eventRepository: IEventRepository,
        ownerRepository: IOwnerRepository,
        userRepository: IUserRepository,
        validator: IValidator<TEventInputDTO>
      ) =>
        new CreateEventUsecase(eventRepository, ownerRepository, userRepository, validator, eventSchema),
      inject: [EventPrismaRepository, OwnerPrismaRepository, UserPrismaRepository, YupAdapter]
    },
    {
      provide: UpdateEventUsecase,
      useFactory: (
        eventRepository: IEventRepository,
        ownerRepository: IOwnerRepository,
        userRepository: IUserRepository,
        validator: IValidator<TEventInputDTO>
      ) =>
        new UpdateEventUsecase(eventRepository, ownerRepository, userRepository, validator, eventSchema),
      inject: [EventPrismaRepository, OwnerPrismaRepository, UserPrismaRepository, YupAdapter]
    },
    {
      provide: FindAllEventsUsecase,
      useFactory: (eventRepository: IEventRepository) =>
        new FindAllEventsUsecase(eventRepository),
      inject: [EventPrismaRepository]
    },
    {
      provide: FindEventByIdUsecase,
      useFactory: (eventRepository: IEventRepository) =>
        new FindEventByIdUsecase(eventRepository),
      inject: [EventPrismaRepository]
    },
    {
      provide: AddPartnerToEventUsecase,
      useFactory: (
        eventRepository: IEventRepository,
        userRepository: IUserRepository,
        validator: IValidator<TEventPartnerInputDTO>,
      ) => new AddPartnerToEventUsecase(eventRepository, userRepository, validator, eventPartnerSchema),
      inject: [EventPrismaRepository, UserPrismaRepository, YupAdapter]
    },
    {
      provide: RemoveEventPartnerUsecase,
      useFactory: (
        eventRepository: IEventRepository,
        userRepository: IUserRepository,
        validator: IValidator<TEventPartnerInputDTO>,
      ) => new RemoveEventPartnerUsecase(eventRepository, userRepository, validator, eventPartnerSchema),
      inject: [EventPrismaRepository, UserPrismaRepository, YupAdapter]
    }
  ],
})
export class EventsModule { }
