import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { YupAdapter } from '../../@core/infra/validation/yup/yup.adapter';
import { UserPrismaRepository } from '../../@core/infra/db/prisma/repositories/user.prisma-repository';
import { prismaClient } from '../../@core/infra/db/prisma';
import { CreateUserUsecase } from '../../@core/application/usecases/user/create-user.usecase';
import { IUserRepository } from '../../@core/domain/repositories/user.repository';
import { IValidator } from '../../@core/domain/interfaces/validator.interface';
import { TUpdateUserInputDTO, TUserInputDTO } from '../../@core/application/dto/user.dto';
import { updateUserSchema, userSchema } from '../../@core/infra/validation/yup/schemas/user.schema';
import { FindUserByIdUsecase } from '../../@core/application/usecases/user/find-user-by-id.usecase';
import { BcryptAdapter } from '../../@core/infra/cryptography/password/bcrypt.adapter';
import { IPasswordCryptography } from '../../@core/domain/interfaces/password-cryptography.interface';
import { UpdateUserUsecase } from '../../@core/application/usecases/user/update-user.usecase';
import { JwtService } from '@nestjs/jwt';

@Module({
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
})
export class UsersModule { }
