import { Test, TestingModule } from '@nestjs/testing';
import { OwnersController } from './owners.controller';
import { JwtService } from '@nestjs/jwt';
import { TOwnerInputDTO } from '../../@core/application/dto/owner.dto';
import { CreateOwnerUsecase } from '../../@core/application/usecases/owner/create-owner.usecase';
import { FindOwnerByEventIdUsecase } from '../../@core/application/usecases/owner/find-owner-by-event-id.usecase';
import { FindOwnerByIdUsecase } from '../../@core/application/usecases/owner/find-owner-by-id.usecase';
import { UpdateOwnerUsecase } from '../../@core/application/usecases/owner/update-owner.usecase';
import { IValidator } from '../../@core/domain/interfaces/validator.interface';
import { IEventRepository } from '../../@core/domain/repositories/event.repository';
import { IOwnerRepository } from '../../@core/domain/repositories/owner.repository';
import { IUserRepository } from '../../@core/domain/repositories/user.repository';
import { prismaClient } from '../../@core/infra/db/prisma';
import { EventPrismaRepository } from '../../@core/infra/db/prisma/repositories/event.prisma-repository';
import { OwnerPrismaRepository } from '../../@core/infra/db/prisma/repositories/owner.prisma-repository';
import { UserPrismaRepository } from '../../@core/infra/db/prisma/repositories/user.prisma-repository';
import { ownerSchema, updateOwnerSchema } from '../../@core/infra/validation/yup/schemas/owner.schema';
import { YupAdapter } from '../../@core/infra/validation/yup/yup.adapter';

describe('OwnersController', () => {
  let controller: OwnersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnersController],
      providers: [
        JwtService,
        { provide: YupAdapter, useClass: YupAdapter },
        { provide: OwnerPrismaRepository, useFactory: () => new OwnerPrismaRepository(prismaClient) },
        { provide: UserPrismaRepository, useFactory: () => new UserPrismaRepository(prismaClient) },
        { provide: EventPrismaRepository, useFactory: () => new EventPrismaRepository(prismaClient) },
        {
          provide: CreateOwnerUsecase,
          useFactory: (
            userRepository: IUserRepository,
            ownerRepository: IOwnerRepository,
            validator: IValidator<TOwnerInputDTO>
          ) =>
            new CreateOwnerUsecase(userRepository, ownerRepository, validator, ownerSchema),
          inject: [UserPrismaRepository, OwnerPrismaRepository, YupAdapter]
        },
        {
          provide: UpdateOwnerUsecase,
          useFactory: (
            ownerRepository: IOwnerRepository,
            validator: IValidator<TOwnerInputDTO>
          ) =>
            new UpdateOwnerUsecase(ownerRepository, validator, updateOwnerSchema),
          inject: [OwnerPrismaRepository, YupAdapter]
        },
        {
          provide: FindOwnerByIdUsecase,
          useFactory: (
            ownerRepository: IOwnerRepository,
          ) =>
            new FindOwnerByIdUsecase(ownerRepository),
          inject: [OwnerPrismaRepository]
        },
        {
          provide: FindOwnerByEventIdUsecase,
          useFactory: (
            ownerRepository: IOwnerRepository,
            eventRepository: IEventRepository
          ) =>
            new FindOwnerByEventIdUsecase(ownerRepository, eventRepository),
          inject: [OwnerPrismaRepository, EventPrismaRepository]
        }
      ],
    }).compile();

    controller = module.get<OwnersController>(OwnersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
