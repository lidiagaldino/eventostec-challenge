import { User } from "../../../../domain/entities/user.entity";
import { Email } from "../../../../domain/value-objects/email.value-object";
import { Password } from "../../../../domain/value-objects/password.value-object";
import { TUserOutputDTO } from "../../../dto/user.dto";
import { mapUserOutput } from "../map";

describe("User Mapper", () => {
  it("should correctly map input data to UserOutputDTO", () => {
    // Arrange
    const id = "123";
    const email = "john@example.com";
    const username = 'johndoe';

    const user: User = User.create({
      email: Email.create({ email }).getValue(),
      password: Password.create({ password: '12345678' }).getValue(),
      username
    }).getValue();
    user.setId(id)

    // Act
    const result: TUserOutputDTO = mapUserOutput(user);

    // Assert
    expect(result.id).toBe(id);
    expect(result.email).toBe(email);
    expect(result.username).toBe(username);
  });
});
