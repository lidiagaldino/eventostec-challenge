
export type EventPrismaOutput = {
  id: string,
  title: string,
  date: Date,
  description: string,
  img_url: string,
  event_url: string,
  remote: boolean,
  address: { city: string, uf: string }
  event_partners: { partner: { id: string, username: string, email: string, password: string } }[]
  owner: { id: string, user: { id: string, username: string, email: string, password: string }, cpf: string }
}
export type CouponPrismaOutput = {
  id: string,
  code: string,
  discount: number,
  valid: boolean,
  event: EventPrismaOutput
}
export type UserPrismaOutput = {
  id: string
  username: string
  email: string
  password: string
}

export type OwnerPrismaOutput = {
  id: string
  cpf: string
  user: UserPrismaOutput
}
