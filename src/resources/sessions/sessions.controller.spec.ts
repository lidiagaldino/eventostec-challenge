import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller';
import { TSessionInputDTO } from '../../@core/application/dto/session.dto';
import { SignInUsecase } from '../../@core/application/usecases/session/sign-in.usecase';
import { IPasswordCryptography } from '../../@core/domain/interfaces/password-cryptography.interface';
import { IUserCryptography } from '../../@core/domain/interfaces/user-cryptography.interface';
import { IValidator } from '../../@core/domain/interfaces/validator.interface';
import { IUserRepository } from '../../@core/domain/repositories/user.repository';
import { BcryptAdapter } from '../../@core/infra/cryptography/password/bcrypt.adapter';
import { JwtAdapter } from '../../@core/infra/cryptography/user/jwt.adapter';
import { prismaClient } from '../../@core/infra/db/prisma';
import { UserPrismaRepository } from '../../@core/infra/db/prisma/repositories/user.prisma-repository';
import { loginSchema } from '../../@core/infra/validation/yup/schemas/session.schema';
import { YupAdapter } from '../../@core/infra/validation/yup/yup.adapter';

describe('SessionsController', () => {
  let controller: SessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [
        {
          provide: UserPrismaRepository,
          useFactory: () => new UserPrismaRepository(prismaClient),
        },
        {
          provide: YupAdapter,
          useClass: YupAdapter,
        },
        {
          provide: JwtAdapter,
          useFactory: () => {
            return new JwtAdapter(process.env.SECRET, process.env.EXPIRES_IN);
          },
        },
        {
          provide: BcryptAdapter,
          useFactory: () => {
            return new BcryptAdapter(Number(process.env.SALT));
          },
        },
        {
          provide: SignInUsecase,
          useFactory: (
            userRepository: IUserRepository,
            userCriptography: IUserCryptography,
            passwordCryptography: IPasswordCryptography,
            validator: IValidator<TSessionInputDTO>,
          ) => {
            return new SignInUsecase(
              userRepository,
              userCriptography,
              passwordCryptography,
              validator,
              loginSchema,
            );
          },
          inject: [UserPrismaRepository, JwtAdapter, BcryptAdapter, YupAdapter],
        },
      ],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
