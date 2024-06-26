import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CreateEventUsecase } from '../../@core/application/usecases/event/create-event.usecase';
import { UpdateEventUsecase } from '../../@core/application/usecases/event/update-event.usecase';
import { FindAllEventsUsecase } from '../../@core/application/usecases/event/find-all-events.usecase';
import { FindEventByIdUsecase } from '../../@core/application/usecases/event/find-event-by-id.usecase';
import { TEventInputDTO, TEventPartnerInputDTO } from '../../@core/application/dto/event.dto';
import { Pagination } from '../../@core/domain/interfaces/pagination.interface';
import { PaginationParams } from '../../@core/infra/decorators/pagination.decorator';
import { Filtering } from '../../@core/domain/interfaces/filtering.interface';
import { FilteringParams } from '../../@core/infra/decorators/filtering.decorator';
import { RemoveEventPartnerUsecase } from '../../@core/application/usecases/event/remove-event-partner.usecase';
import { AddPartnerToEventUsecase } from '../../@core/application/usecases/event/add-partner-to-event.usecase';
import { AuthGuard } from '../../@core/infra/cryptography/user/auth-guard';
import { Roles } from '../../@core/infra/decorators/roles.decorator';
import { Role } from '../../@core/domain/enums/role.enum';
import { RolesGuard } from '../../@core/infra/cryptography/user/roles-guard';
import { FilterRule } from '../../@core/domain/enums/filtering.enum';


@Controller('events')
export class EventsController {
  constructor(
    private readonly createUsecase: CreateEventUsecase,
    private readonly updateUsecase: UpdateEventUsecase,
    private readonly findAllUsecase: FindAllEventsUsecase,
    private readonly findByIdUsecase: FindEventByIdUsecase,
    private readonly removePartnerUsecase: RemoveEventPartnerUsecase,
    private readonly addPartnerUsecase: AddPartnerToEventUsecase
  ) { }

  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createEventDto: TEventInputDTO) {
    return this.createUsecase.execute(createEventDto);
  }

  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
  @Put("partner/add")
  addPartner(@Body() addPartnerDto: TEventPartnerInputDTO) {
    return this.addPartnerUsecase.execute(addPartnerDto);
  }

  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
  @Put("partner/remove")
  removePartner(@Body() removePartnerDto: TEventPartnerInputDTO) {
    return this.removePartnerUsecase.execute(removePartnerDto)
  }

  @Get()
  findAll(
    @PaginationParams() paginationParams: Pagination,
    @FilteringParams([
      { filter: 'title', permittedFilterRules: [FilterRule.CONTAINS] },
      { filter: 'date', permittedFilterRules: [FilterRule.GREATER_THAN_OR_EQUALS, FilterRule.GREATER_THAN] },
      { filter: 'uf', permittedFilterRules: [FilterRule.EQUALS] },
      { filter: 'city', permittedFilterRules: [FilterRule.CONTAINS] }
    ])
    filter?: Filtering[],
  ) {
    console.log(filter)
    return this.findAllUsecase.execute(paginationParams, filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findByIdUsecase.execute(id);
  }

  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: TEventInputDTO) {
    return this.updateUsecase.execute(id, updateEventDto);
  }

}
