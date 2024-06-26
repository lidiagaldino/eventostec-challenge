import { PrismaClient } from '@prisma/client';
import { IEventRepository } from '../../../../domain/repositories/event.repository';
import { Event } from '../../../../domain/entities/event.entity';
import { Url } from '../../../../domain/value-objects/url.value-object';
import { Address } from '../../../../domain/value-objects/address.value-object';
import { EventPrismaOutput } from './types/prisma-output.type';
import { Filtering } from '../../../../domain/interfaces/filtering.interface';
import { Pagination, PaginatedResource } from '../../../../domain/interfaces/pagination.interface';
import { getEventFiltering } from './helpers/filtering.helper';
import { User } from '../../../../domain/entities/user.entity';
import { Email } from '../../../../domain/value-objects/email.value-object';
import { Password } from '../../../../domain/value-objects/password.value-object';
import { Owner } from '../../../../domain/entities/owner.entity';

export class EventPrismaRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaClient) { }
  async create(event: Event): Promise<Event> {
    let address: { id: string, city: string, uf: string } = null
    if (event.getAddress()) address = await this.findOrCreateAddress(event.getAddress())

    const result = await this.prisma.event.create({
      data: {
        title: event.getTitle(),
        date: event.getDate(),
        event_url: event.getEventUrl().getUrl(),
        description: event.getDescription(),
        img_url: event.getImgUrl().getUrl(),
        remote: event.getRemote(),
        owner: { connect: { id: event.getOwner().getId() } },
        event_partners: event.getPartners() ? {
          createMany: {
            data: event.getPartners().map(item => ({ userId: item.getId() }))
          }
        } : {},
        address: address != null ? { connect: { id: address.id } } : {}
      }
    })
    event.setId(result.id)
    return event
  }

  async update(event: Event): Promise<Event> {
    let address: { id: string, city: string, uf: string } = null
    if (event.getAddress()) address = await this.findOrCreateAddress(event.getAddress())

    await this.prisma.event.update({
      where: { id: event.getId() },
      data: {
        title: event.getTitle(),
        date: event.getDate(),
        event_url: event.getEventUrl().getUrl(),
        description: event.getDescription(),
        img_url: event.getImgUrl().getUrl(),
        remote: event.getRemote(),
        address: address ? { connect: { id: address.id } } : {}
      }
    })
    return event
  }

  async delete(event: Event): Promise<void> {
    await this.prisma.event.delete({ where: { id: event.getId() } })
    return
  }

  async findAll(
    pagination: Pagination,
    filtering: Filtering[],
  ): Promise<PaginatedResource<Event>> {
    console.log(filtering)
    const where = getEventFiltering(filtering)
    console.log(where)
    const events = await this.prisma.event.findMany({
      where,
      include: {
        address: true,
        event_partners: { select: { partner: true } },
        owner: { include: { user: true } }
      },
      take: pagination.limit,
      skip: pagination.offset
    })
    if (events.length == 0) return null
    return {
      items: events.map(this.mapOutput),
      page: pagination.page,
      size: pagination.size,
      totalItems: events.length
    }
  }

  async findById(id: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        address: true,
        event_partners: { select: { partner: true } },
        owner: { include: { user: true } }
      }
    });
    if (!event) return null
    return this.mapOutput(event)
  }

  async addPartner(event: Event, user: User): Promise<void> {
    await this.prisma.event_partners.create({
      data: {
        event: { connect: { id: event.getId() } },
        partner: { connect: { id: user.getId() } }
      }
    })
    return
  }

  async removePartner(event: Event, user: User): Promise<void> {
    await this.prisma.event_partners.deleteMany({
      where: {
        event: { id: event.getId() },
        partner: { id: user.getId() }
      }
    })
    return
  }

  async verifyIfPartnerExists(event: Event, user: User): Promise<boolean> {
    const result = await this.prisma.event_partners.findFirst({
      where: {
        event: { id: event.getId() },
        partner: { id: user.getId() }
      }
    })
    return !!result
  }

  private async findOrCreateAddress(address: Address) {
    const findAddress = await this.prisma.address.findFirst({
      where: { city: address.getCity(), uf: address.getCity() }
    })
    if (!findAddress) {
      const createdAddress = await this.prisma.address.create({
        data: { city: address.getCity(), uf: address.getCity() }
      })
      return createdAddress
    } else return findAddress

  }

  private mapOutput(input: EventPrismaOutput) {
    const img_url = Url.create({ url: input.img_url }).getValue()
    const event_url = Url.create({ url: input.event_url }).getValue()
    const email = Email.create({ email: input.owner.user.email }).getValue()
    const password = Password.create({ password: input.owner.user.password }).getValue()
    const userOwner = User.create({ ...input.owner.user, email, password }).getValue()
    const owner = Owner.create({ user: userOwner, cpf: input.owner.cpf }).getValue()
    owner.setId(input.owner.id)
    const partners = input.event_partners.map(item => {
      const partnerEmail = Email.create({ email: item.partner.email }).getValue()
      const partnerPassword = Password.create({ password: item.partner.password }).getValue()
      const partner =
        User.create({ email: partnerEmail, password: partnerPassword, username: item.partner.username }).getValue()
      partner.setId(item.partner.id)
      return partner
    })
    const address = input.address ?
      Address.create({ city: input.address.city, uf: input.address.uf }).getValue()
      : null
    const event = Event.create({
      ...input,
      img_url,
      event_url,
      address,
      owner,
      partners
    }).getValue()
    event.setId(input.id)
    return event
  };
}
