import { TUserInputDTO } from "../../dto/user.dto";
import { userFactory } from "../user.factory";

describe("User Factory", () => {
  it("should return left for invalid email", () => {
    const input: TUserInputDTO = {
      username: "test",
      email: "invalid_email",
      password: "password123",
    };
    const result = userFactory(input);
    expect(result.isLeft()).toBe(true);
  });

  it("should return left for invalid password", () => {
    const input: TUserInputDTO = {
      username: "test",
      email: "test@example.com",
      password: "short",
    };
    const result = userFactory(input);
    expect(result.isLeft()).toBe(true);
  });

  it("should return right for valid input", () => {
    const input: TUserInputDTO = {
      username: "test",
      email: "test@example.com",
      password: "password123",
    };
    const result = userFactory(input);
    expect(result.isRight()).toBe(true);
  });

  it("should return left for missing username", () => {
    const input: any = {
      email: "test@example.com",
      password: "password123",
    };
    const result = userFactory(input);
    expect(result.isLeft()).toBe(true);
  });

  it("should return left for missing email", () => {
    const input: any = {
      username: "test",
      password: "password123",
    };
    const result = userFactory(input);
    expect(result.isLeft()).toBe(true);
  });
});
