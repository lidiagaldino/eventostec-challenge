import { Owner } from "../../../../domain/entities/owner.entity";
import { User } from "../../../../domain/entities/user.entity";
import { Email } from "../../../../domain/value-objects/email.value-object";
import { Password } from "../../../../domain/value-objects/password.value-object";
import { TOwnerOutputDTO } from "../../../dto/owner.dto";
import { mapOwnerOutput } from "../map";

describe("mapOwnerOutput function", () => {
  const user = User.create({
    email: Email.create({ email: 'john@example.com' }).getValue(),
    password: Password.create({ password: "12345678" }).getValue(),
    username: "John Doe",
  }).getValue();
  user.setId("123")
  const owner = Owner.create({
    cpf: "45078224084",
    user
  }).getValue();
  owner.setId("123")
  it("should map an owner entity to a DTO correctly", () => {
    const expectedOutput: TOwnerOutputDTO = {
      id: "123",
      user_id: "123",
      cpf: owner.getCpf(),
    };
    const output = mapOwnerOutput(owner);
    expect(output).toEqual(expectedOutput);
  });
});
