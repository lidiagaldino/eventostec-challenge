import { Email } from "../../value-objects/email.value-object";
import { Password } from "../../value-objects/password.value-object";
import { Owner } from "../owner.entity";
import { User } from "../user.entity";

describe("Owner", () => {
  let owner: Owner;
  let user: User;

  beforeEach(() => {
    user = User.create({
      email: Email.create({ email: 'lidia@gmail.com' }).getValue(),
      password: Password.create({ password: '12345678' }).getValue(),
      username: 'Lidia'
    }).getValue()
    owner = Owner.create({
      cpf: '45078224084',
      user
    }).getValue()
  });

  it("should change the cpf correctly", () => {
    const newCpf = "987.654.321-99";
    owner.setCpf(newCpf);

    expect(owner.getCpf()).toBe(newCpf);
  });

  it("should not create a owner when an empty string is provided to cpf field", () => {
    const ownerProps: any = {
      cpf: null,
      user
    }
    const failedOwner = Owner.create(ownerProps)

    expect(failedOwner.isFailure).toBe(true)
    expect(failedOwner.getErrorValue()).toBe('cpf is null or undefined')
  });
});
