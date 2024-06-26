import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CreateOwnerUsecase } from '../../@core/application/usecases/owner/create-owner.usecase';
import { UpdateOwnerUsecase } from '../../@core/application/usecases/owner/update-owner.usecase';
import { FindOwnerByIdUsecase } from '../../@core/application/usecases/owner/find-owner-by-id.usecase';
import { FindOwnerByEventIdUsecase } from '../../@core/application/usecases/owner/find-owner-by-event-id.usecase';
import { TOwnerInputDTO, TUpdateOwnerInputDTO } from '../../@core/application/dto/owner.dto';
import { AuthGuard } from '../../@core/infra/cryptography/user/auth-guard';
import { Role } from '../../@core/domain/enums/role.enum';
import { RolesGuard } from '../../@core/infra/cryptography/user/roles-guard';
import { Roles } from '../../@core/infra/decorators/roles.decorator';

@Controller('owners')
export class OwnersController {
  constructor(
    private readonly createUsecase: CreateOwnerUsecase,
    private readonly updateUsecase: UpdateOwnerUsecase,
    private readonly findByIdUsecase: FindOwnerByIdUsecase,
    private readonly findByEventIdUsecase: FindOwnerByEventIdUsecase
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOwnerDto: TOwnerInputDTO) {
    return this.createUsecase.execute(createOwnerDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findByIdUsecase.execute(id);
  }

  @Get('/event/:id')
  findByEvent(@Param('id') id: string) {
    return this.findByEventIdUsecase.execute(id);
  }

  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateOwnerDto: TUpdateOwnerInputDTO) {
    return this.updateUsecase.execute(id, updateOwnerDto);
  }
}
