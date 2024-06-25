import { Guard } from "../shared/guard/guard";
import { Result } from "../shared/result/result";

export type TEmailProps = {
  email: string;
};

/**
 * Represents an email value object.
 */
export class Email {
  props: TEmailProps;

  private constructor(props: TEmailProps) {
    this.props = props;
  }

  /**
   * Creates a new Email instance.
   * @param {TEmailProps} props - The properties of the email.
   * @returns A Result object containing either the created Email instance or an error.
   */
  public static create(props: TEmailProps): Result<Email> {
    if (!props) return Result.fail<Email>('email is null or undefined');
    const guardResult = Guard.againstNullOrUndefined(props.email, 'email');
    if (guardResult.isFailure || !Email.isEmailValid(props.email)) {
      return Result.fail<Email>(
        guardResult.getErrorValue()
          ? guardResult.getErrorValue()
          : 'Invalid email',
      );
    }
    return Result.ok<Email>(new Email(props));
  }

  /**
   * Checks if an email is valid.
   * @param email - The email to validate.
   * @returns True if the email is valid, false otherwise.
   */
  static isEmailValid(email: string): boolean {
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }

  /**
   * Gets the email value.
   * @returns The email value.
   */
  getEmail() {
    return this.props.email;
  }
}
