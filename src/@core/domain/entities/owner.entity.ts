import { Guard } from "../shared/guard/guard"
import { Result } from "../shared/result/result"
import { User } from "./user.entity"

export type TOwnerProps = {
  cpf: string
  user: User
}

export class Owner {
  private id: string
  private props: TOwnerProps

  private constructor(props: TOwnerProps) {
    this.props = props
  }

  public static create(owner: TOwnerProps): Result<Owner> {
    const guardResult = Guard.combine([
      Guard.againstNullOrUndefined(owner.cpf, 'cpf'),
      Guard.againstNullOrUndefined(owner.user, 'user')
    ])

    if (guardResult.isFailure) return Result.fail(guardResult.getErrorValue())

    return Result.ok(new Owner(owner))
  }

  setId(id: string) {
    this.id = id
  }

  setCpf(cpf: string) {
    this.props.cpf = cpf
  }

  getId() {
    return this.id
  }

  getCpf() {
    return this.props.cpf
  }

  getUser() {
    return this.props.user
  }
}
