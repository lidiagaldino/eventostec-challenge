import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CreateCouponUsecase } from '../../@core/application/usecases/coupon/create-coupon.usecase';
import { FindCouponByCodeUsecase } from '../../@core/application/usecases/coupon/find-coupon-by-code.usecase';
import { FindCouponByIdUsecase } from '../../@core/application/usecases/coupon/find-coupon-by-id.usecase';
import { TCouponInputDTO } from '../../@core/application/dto/coupon.dto';
import { Request } from 'express';
import { AuthGuard } from '../../@core/infra/cryptography/user/auth-guard';

@Controller('coupons')
export class CouponsController {
  constructor(
    private readonly createUsecase: CreateCouponUsecase,
    private readonly findByCodeUsecase: FindCouponByCodeUsecase,
    private readonly findByIdUsecase: FindCouponByIdUsecase
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCouponDto: TCouponInputDTO, @Req() req: Request) {
    const jwt = req.headers['authorization']?.replace('Bearer ', '');
    return this.createUsecase.execute(createCouponDto, jwt);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findByIdUsecase.execute(id);
  }

  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.findByCodeUsecase.execute(code);
  }
}
