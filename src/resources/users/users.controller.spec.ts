import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { TUserInputDTO, TUpdateUserInputDTO } from '../../@core/application/dto/user.dto';
import { CreateUserUsecase } from '../../@core/application/usecases/user/create-user.usecase';
import { FindUserByIdUsecase } from '../../@core/application/usecases/user/find-user-by-id.usecase';
import { UpdateUserUsecase } from '../../@core/application/usecases/user/update-user.usecase';
import { IPasswordCryptography } from '../../@core/domain/interfaces/password-cryptography.interface';
import { IValidator } from '../../@core/domain/interfaces/validator.interface';
import { IUserRepository } from '../../@core/domain/repositories/user.repository';
import { BcryptAdapter } from '../../@core/infra/cryptography/password/bcrypt.adapter';
import { prismaClient } from '../../@core/infra/db/prisma';
import { UserPrismaRepository } from '../../@core/infra/db/prisma/repositories/user.prisma-repository';
import { updateUserSchema, userSchema } from '../../@core/infra/validation/yup/schemas/user.schema';
import { YupAdapter } from '../../@core/infra/validation/yup/yup.adapter';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        JwtService,
        { provide: YupAdapter, useClass: YupAdapter },
        { provide: UserPrismaRepository, useFactory: () => new UserPrismaRepository(prismaClient) },
        { provide: BcryptAdapter, useFactory: () => new BcryptAdapter(8) }, //TODO: add salt to .env
        {
          provide: CreateUserUsecase,
          useFactory: (
            userRepository: IUserRepository,
            passwordCryptography: IPasswordCryptography,
            validator: IValidator<TUserInputDTO>
          ) =>
            new CreateUserUsecase(userRepository, passwordCryptography, validator, userSchema),
          inject: [UserPrismaRepository, BcryptAdapter, YupAdapter]
        },
        {
          provide: FindUserByIdUsecase,
          useFactory: (userRepository: IUserRepository) =>
            new FindUserByIdUsecase(userRepository),
          inject: [UserPrismaRepository]
        },
        {
          provide: UpdateUserUsecase,
          useFactory: (
            userRepository: IUserRepository,
            validator: IValidator<TUpdateUserInputDTO>,
          ) => new UpdateUserUsecase(userRepository, validator, updateUserSchema),
          inject: [UserPrismaRepository, YupAdapter]
        },

      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
