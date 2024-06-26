import { PrismaClient } from "@prisma/client";
import { ICouponRepository } from "../../../../domain/repositories/coupon.repository";
import { Coupon } from "../../../../domain/entities/coupon.entity";
import { CouponPrismaOutput } from "./types/prisma-output.type";
import { Url } from "../../../../domain/value-objects/url.value-object";
import { Address } from "../../../../domain/value-objects/address.value-object";
import { Event } from "../../../../domain/entities/event.entity";
import { Email } from "../../../../domain/value-objects/email.value-object";
import { Owner } from "../../../../domain/entities/owner.entity";
import { User } from "../../../../domain/entities/user.entity";
import { Password } from "../../../../domain/value-objects/password.value-object";

export class CouponPrismaRepository implements ICouponRepository {
  constructor(private readonly prisma: PrismaClient) { }
  async findById(id: string): Promise<Coupon> {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: {
        event: {
          include: {
            address: true,
            owner: { include: { user: true } },
            event_partners: { include: { partner: true } }
          }
        }
      }
    })

    return this.mapOutput(coupon)
  }
  async create(coupon: Coupon): Promise<Coupon> {
    const result = await this.prisma.coupon.create({
      data: {
        code: coupon.getCode(),
        discount: coupon.getDiscount(),
        valid: coupon.getValid(),
        event: { connect: { id: coupon.getEvent().getId() } }
      }
    })
    coupon.setId(result.id)
    return coupon
  }
  async update(coupon: Coupon): Promise<Coupon> {
    await this.prisma.coupon.update({
      where: {
        id: coupon.getId()
      },
      data: {
        code: coupon.getCode(),
        discount: coupon.getDiscount(),
        valid: coupon.getValid(),
        event: { connect: { id: coupon.getEvent().getId() } }
      }
    })
    return coupon
  }
  async delete(coupon: Coupon): Promise<void> {
    await this.prisma.coupon.delete({
      where: { id: coupon.getId() }
    })
    return
  }
  async findAll(): Promise<Coupon[]> {
    const coupons = await this.prisma.coupon.findMany({
      include: {
        event: {
          include: {
            address: true,
            owner: { include: { user: true } },
            event_partners: { include: { partner: true } }
          }
        }
      }
    })
    return coupons.map(this.mapOutput)
  }
  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.prisma.coupon.findFirst({
      where: { code },
      include: {
        event: {
          include: {
            address: true,
            owner: { include: { user: true } },
            event_partners: { include: { partner: true } }
          }
        }
      }
    })
    return this.mapOutput(coupon)
  }
  async findByEventId(eventId: string): Promise<Coupon[]> {
    const coupons = await this.prisma.coupon.findMany({
      where: { eventId },
      include: {
        event: {
          include: {
            address: true,
            owner: { include: { user: true } },
            event_partners: { include: { partner: true } }
          }
        }
      }
    })
    return coupons.map(this.mapOutput)
  }

  private mapOutput(input: CouponPrismaOutput) {
    const img_url = Url.create({ url: input.event.img_url }).getValue()
    const event_url = Url.create({ url: input.event.event_url }).getValue()
    const address = Address.create({ city: input.event.address.city, uf: input.event.address.uf }).getValue()
    const email = Email.create({ email: input.event.owner.user.email }).getValue()
    const password = Password.create({ password: input.event.owner.user.password }).getValue()
    const userOwner = User.create({ ...input.event.owner.user, email, password }).getValue()
    const owner = Owner.create({ user: userOwner, cpf: input.event.owner.cpf }).getValue()
    owner.setId(input.event.owner.id)
    const partners = input.event.event_partners.map(item => {
      const partnerEmail = Email.create({ email: item.partner.email }).getValue()
      const partnerPassword = Password.create({ password: item.partner.password }).getValue()
      const partner =
        User.create({ email: partnerEmail, password: partnerPassword, username: item.partner.username }).getValue()
      partner.setId(item.partner.id)
      return partner
    })
    const event = Event.create({
      ...input.event,
      img_url,
      event_url,
      address,
      owner,
      partners
    }).getValue()
    event.setId(input.id)
    const coupon = Coupon.create({ ...input, event }).getValue()
    coupon.setId(input.id)
    return coupon
  }
}
