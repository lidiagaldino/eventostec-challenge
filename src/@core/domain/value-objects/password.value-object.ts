import { Guard } from "../shared/guard/guard";
import { Result } from "../shared/result/result";

export type TPasswordProps = {
  password: string;
};

/**
 * A class representing a password.
 */
export class Password {
  private props: TPasswordProps;

  /**
   * Private constructor to prevent instantiation of the Password class from outside.
   * @param props The password properties.
   */
  private constructor(props: TPasswordProps) {
    this.props = props;
  }

  /**
   * Creates a new instance of the Password class.
   * @param props The password properties.
   * @returns A Result object containing the created Password instance or an error if the password is null or undefined or less than 8 characters.
   */
  public static create(props: TPasswordProps): Result<Password> {
    const guardResults = Guard.combine([
      Guard.againstNullOrUndefined(props.password, 'password'),
      Guard.againstAtLeast(8, props.password),
    ]);

    if (guardResults.isFailure) {
      return Result.fail(guardResults.getErrorValue());
    }

    return Result.ok(new Password(props));
  }

  /**
   * Gets the password property.
   * @returns The password string.
   */
  getPassword(): string {
    return this.props.password;
  }
}
