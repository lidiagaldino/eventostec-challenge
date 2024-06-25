/**
 * Represents a result of an operation that can either be successful or a failure.
 * The result can contain a value of type T or an error message.
 *
 * @template T - The type of the value contained in the result.
 */
export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  private error: T | string;
  private _value: T;

  /**
   * Creates a new instance of the Result class.
   *
   * @param isSuccess - Indicates whether the result is successful or a failure.
   * @param error - The error message or value associated with the failure.
   * @param value - The value associated with the successful result.
   * @throws {Error} - If the result is invalid (e.g., a successful result with an error message).
   */
  public constructor(isSuccess: boolean, error?: T | string, value?: T) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error',
      );
    }
    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error message',
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  /**
   * Gets the value contained in the successful result.
   * Throws an error if the result is a failure.
   *
   * @returns The value of type T.
   * @throws {Error} - If the result is a failure.
   */
  public getValue(): T {
    if (!this.isSuccess) {
      console.log(this.error);
      throw new Error(
        "Can't get the value of an error result. Use 'getErrorValue' instead.",
      );
    }

    return this._value;
  }

  /**
   * Gets the error value contained in the result.
   * Returns the error message or value associated with the failure.
   *
   * @returns The error value of type T.
   */
  public getErrorValue(): T {
    return this.error as T;
  }

  /**
   * Creates a new successful result with an optional value.
   *
   * @template U - The type of the value contained in the new result.
   * @param value - The value associated with the successful result.
   * @returns A new Result instance representing a successful result.
   */
  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  /**
   * Creates a new failure result with an error message.
   *
   * @template U - The type of the value contained in the new result.
   * @param error - The error message associated with the failure.
   * @returns A new Result instance representing a failure result.
   */
  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  /**
   * Combines multiple results into a single result.
   * If any of the results is a failure, returns the first failure result.
   * If all results are successful, returns a successful result.
   *
   * @param results - An array of Result instances to combine.
   * @returns A combined Result instance.
   */
  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}
