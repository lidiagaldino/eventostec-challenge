import { Guard } from "../shared/guard/guard"
import { Result } from "../shared/result/result"
import { Email } from "../value-objects/email.value-object"
import { Password } from "../value-objects/password.value-object"

export type TUserProps = {
  username: string
  email: Email
  password: Password
}

export class User {
  private id: string
  private props: TUserProps

  private constructor(props: TUserProps) {
    this.props = props
  }

  public static create(user: TUserProps): Result<User> {
    const guardResults = Guard.combine([
      Guard.againstNullOrUndefined(user.username, 'username'),
      Guard.againstNullOrUndefined(user.email, 'email'),
      Guard.againstNullOrUndefined(user.password, 'password')
    ])

    if (guardResults.isFailure) return Result.fail(guardResults.getErrorValue())

    return Result.ok(new User(user))
  }

  setId(id: string) {
    this.id = id
  }

  setUsername(username: string) {
    this.props.username = username
  }

  setPassword(password: Password) {
    this.props.password = password
  }

  setEmail(email: Email) {
    this.props.email = email
  }

  getId() {
    return this.id
  }

  getUsername() {
    return this.props.username
  }

  getEmail() {
    return this.props.email
  }

  getPassword() {
    return this.props.password
  }
}
