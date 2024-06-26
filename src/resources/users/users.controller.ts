import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { CreateUserUsecase } from '../../@core/application/usecases/user/create-user.usecase';
import { FindUserByIdUsecase } from '../../@core/application/usecases/user/find-user-by-id.usecase';
import { TUpdateUserInputDTO, TUserInputDTO } from '../../@core/application/dto/user.dto';
import { UpdateUserUsecase } from '../../@core/application/usecases/user/update-user.usecase';
import { AuthGuard } from '../../@core/infra/cryptography/user/auth-guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUsecase: CreateUserUsecase,
    private readonly findByIdUsecase: FindUserByIdUsecase,
    private readonly updateUsecase: UpdateUserUsecase,
  ) { }

  @Post()
  create(@Body() createUserDto: TUserInputDTO) {
    return this.createUsecase.execute(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findByIdUsecase.execute(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: TUpdateUserInputDTO) {
    return this.updateUsecase.execute(id, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
