
import { Owner } from "../../../domain/entities/owner.entity";
import { left } from "../../../domain/shared/result/left.result";
import { right } from "../../../domain/shared/result/right.result";
import { ownerFactory } from "../owner.factory";
import { userFactory } from "../user.factory";


describe("ownerFactory", () => {
  it("should create an owner successfully", () => {
    const user = userFactory({ username: "John Doe", email: "john.doe@example.com", password: 'password' }).value.getValue();
    const owner = ownerFactory({ cpf: "123.456.789-00", user });

    expect(owner.isRight()).toEqual(true);
    expect(owner.value.getValue()).toBeInstanceOf(Owner)
  });

  it("should return an error when creating an owner with a null user", () => {
    const owner = ownerFactory({ cpf: "123.456.789-00", user: null });

    expect(owner.isLeft()).toEqual(true);
    expect(owner.value.getErrorValue()).toEqual("user is null or undefined");
  });

  it("should return an error when creating an owner with a null CPF", () => {
    const user = userFactory({ username: "John Doe", email: "john.doe@example.com", password: 'password' }).value.getValue();
    const owner = ownerFactory({ cpf: null, user });

    expect(owner.isLeft()).toEqual(true);
    expect(owner.value.getErrorValue()).toEqual("cpf is null or undefined");
  });
});
