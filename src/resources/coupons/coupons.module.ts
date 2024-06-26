import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { YupAdapter } from '../../@core/infra/validation/yup/yup.adapter';
import { EventPrismaRepository } from '../../@core/infra/db/prisma/repositories/event.prisma-repository';
import { prismaClient } from '../../@core/infra/db/prisma';
import { CouponPrismaRepository } from '../../@core/infra/db/prisma/repositories/coupon.prisma-repository';
import { CreateCouponUsecase } from '../../@core/application/usecases/coupon/create-coupon.usecase';
import { ICouponRepository } from '../../@core/domain/repositories/coupon.repository';
import { IEventRepository } from '../../@core/domain/repositories/event.repository';
import { IValidator } from '../../@core/domain/interfaces/validator.interface';
import { TCouponInputDTO } from '../../@core/application/dto/coupon.dto';
import { couponSchema } from '../../@core/infra/validation/yup/schemas/coupon.schema';
import { FindCouponByCodeUsecase } from '../../@core/application/usecases/coupon/find-coupon-by-code.usecase';
import { FindCouponByIdUsecase } from '../../@core/application/usecases/coupon/find-coupon-by-id.usecase';
import { UserPrismaRepository } from '../../@core/infra/db/prisma/repositories/user.prisma-repository';
import { JwtAdapter } from '../../@core/infra/cryptography/user/jwt.adapter';
import { IUserRepository } from '../../@core/domain/repositories/user.repository';
import { IUserCryptography } from '../../@core/domain/interfaces/user-cryptography.interface';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CouponsController],
  providers: [
    JwtService,
    { provide: YupAdapter, useClass: YupAdapter },
    {
      provide: JwtAdapter,
      useFactory: () => {
        return new JwtAdapter(process.env.SECRET, process.env.EXPIRES_IN);
      },
    },
    { provide: EventPrismaRepository, useFactory: () => new EventPrismaRepository(prismaClient) },
    { provide: CouponPrismaRepository, useFactory: () => new CouponPrismaRepository(prismaClient) },
    { provide: UserPrismaRepository, useFactory: () => new UserPrismaRepository(prismaClient) },
    {
      provide: CreateCouponUsecase,
      useFactory: (
        couponRepository: ICouponRepository,
        eventRepository: IEventRepository,
        userRepository: IUserRepository,
        userCriptography: IUserCryptography,
        validator: IValidator<TCouponInputDTO>) =>
        new CreateCouponUsecase(couponRepository, eventRepository, userRepository, userCriptography, validator, couponSchema),
      inject: [CouponPrismaRepository, EventPrismaRepository, UserPrismaRepository, JwtAdapter, YupAdapter]
    },
    {
      provide: FindCouponByCodeUsecase,
      useFactory: (
        couponRepository: ICouponRepository,
      ) =>
        new FindCouponByCodeUsecase(couponRepository),
      inject: [CouponPrismaRepository]
    },
    {
      provide: FindCouponByIdUsecase,
      useFactory: (
        couponRepository: ICouponRepository,
      ) =>
        new FindCouponByIdUsecase(couponRepository),
      inject: [CouponPrismaRepository]
    }
  ],
})
export class CouponsModule { }
