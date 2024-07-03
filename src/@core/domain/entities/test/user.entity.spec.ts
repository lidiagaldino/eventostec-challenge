import { Email } from "../../value-objects/email.value-object";
import { Password } from "../../value-objects/password.value-object";
import { User } from "../user.entity";

describe('User', () => {
  let user: User;

  beforeEach(() => {
    user = User.create({
      email: Email.create({ email: 'lidia@gmail.com' }).getValue(),
      password: Password.create({ password: '12345678' }).getValue(),
      username: 'Lidia'
    }).getValue()
  });

  it('should create a user correctly', () => {
    const user = User.create({
      email: Email.create({ email: 'lidia@gmail.com' }).getValue(),
      password: Password.create({ password: '12345678' }).getValue(),
      username: 'Lidia'
    })

    expect(user.isSuccess).toBe(true)
  })

  it('should throw an error if email is empty', () => {
    const userProps: any = {
      password: Password.create({ password: '12345678' }).getValue(),
      username: 'Lidia'
    }
    const user = User.create(userProps)

    expect(user.isFailure).toBe(true)
    expect(user.getErrorValue()).toEqual('email is null or undefined')
  })

  it('should throw an error if password is empty', () => {
    const userProps: any = {
      email: Email.create({ email: 'lidia@gmail.com' }).getValue(),
      username: 'Lidia'
    }
    const user = User.create(userProps)

    expect(user.isFailure).toBe(true)
    expect(user.getErrorValue()).toEqual('password is null or undefined')
  })

  it('should throw an error if username is empty', () => {
    const userProps: any = {
      email: Email.create({ email: 'lidia@gmail.com' }).getValue(),
      password: Password.create({ password: '12345678' }).getValue()
    }
    const user = User.create(userProps)

    expect(user.isFailure).toBe(true)
    expect(user.getErrorValue()).toEqual('username is null or undefined')
  })

  it('should set username correctly', () => {
    user.setUsername('newUsername');
    expect(user.getUsername()).toBe('newUsername');
  });

  it('should set email correctly', () => {
    const email = Email.create({ email: 'newEmail@example.com' }).getValue()
    user.setEmail(email);
    expect(user.getEmail().getEmail()).toBe('newEmail@example.com');
  });

  it('should set password correctly', () => {
    const password = Password.create({ password: 'newPassword' }).getValue()
    user.setPassword(password);
    expect(user.getPassword().getPassword()).toBe('newPassword');
  });

  it('should set id correctly', () => {
    user.setId('123');
    expect(user.getId()).toBe('123');
  });
});
