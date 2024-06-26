import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SignInUsecase } from '../../@core/application/usecases/session/sign-in.usecase';
import { TSessionInputDTO } from '../../@core/application/dto/session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly signInUsecase: SignInUsecase) { }

  @Post()
  create(@Body() createSessionDto: TSessionInputDTO) {
    return this.signInUsecase.execute(createSessionDto);
  }
}
