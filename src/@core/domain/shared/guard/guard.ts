export type GuardResponse = string;

import { Result } from '../result/result';

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];
/**
 * The `Guard` class provides static methods for performing common validation checks.
 * It is used to ensure that certain conditions are met before proceeding with further operations.
 */
export class Guard {
  /**
    Combines a list of guard results into a single result. If any of the results are failures, the combined result will also be a failure. If all of the results are successes, the combined result will be a success.
    @param guardResults - The list of guard results to combine.
    @returns A single guard result that is the combination of all of the input guard results.
 */
  public static combine(guardResults: Result<any>[]): Result<GuardResponse> {
    for (const result of guardResults) {
      if (result.isFailure) return result;
    }

    return Result.ok<GuardResponse>();
  }

  /** 
    Checks if a number is greater than a minimum value.
    @param minValue - The minimum value.
    @param actualValue - The actual value to check.
    @returns A Result indicating whether the actual value is greater than the minimum value.
 */
  public static greaterThan(
    minValue: number,
    actualValue: number,
  ): Result<GuardResponse> {
    return actualValue > minValue
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
          `Number given {${actualValue}} is not greater than {${minValue}}`,
        );
  }

  /**
   * Checks if a string is at least a certain length.
   *
   * @param numChars - The minimum number of characters the string must be.
   * @param text - The string to check.
   * @returns A Result indicating whether the string is at least the specified length.
   */
  public static againstAtLeast(
    numChars: number,
    text: string,
  ): Result<GuardResponse> {
    return text?.length >= numChars
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(`Text is not at least ${numChars} chars.`);
  }

  /**
   * Checks if a string is at most a certain length.
   *
   * @param numChars - The maximum number of characters the string can be.
   * @param text - The string to check.
   * @returns A Result indicating whether the string is at most the specified length.
   */
  public static againstAtMost(
    numChars: number,
    text: string,
  ): Result<GuardResponse> {
    return text?.length <= numChars
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(`Text is greater than ${numChars} chars.`);
  }

  /**
   * Checks if a value is null or undefined.
   *
   * @param argument - The value to check.
   * @param argumentName - The name of the argument being checked.
   * @returns A Result indicating whether the value is null or undefined.
   */
  public static againstNullOrUndefined(
    argument: any,
    argumentName: string,
  ): Result<GuardResponse> {
    if (argument === null || argument === undefined) {
      return Result.fail<GuardResponse>(`${argumentName} is null or undefined`);
    } else {
      return Result.ok<GuardResponse>();
    }
  }

  /**
   * Checks if a value is null or undefined.
   *
   * @param args - The list of arguments to check.
   * @returns A Result indicating whether all of the values are null or undefined.
   */
  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection,
  ): Result<GuardResponse> {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName,
      );
      if (result.isFailure) return result;
    }

    return Result.ok<GuardResponse>();
  }

  /**
   * Checks if a value is one of a set of allowed values.
   *
   * @param value - The value to check.
   * @param validValues - The set of allowed values.
   * @param argumentName - The name of the argument being checked.
   * @returns A Result indicating whether the value is one of the allowed values.
   */
  public static isOneOf(
    value: any,
    validValues: any[],
    argumentName: string,
  ): Result<GuardResponse> {
    let isValid = false;
    for (const validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return Result.ok<GuardResponse>();
    } else {
      return Result.fail<GuardResponse>(
        `${argumentName} isn't oneOf the correct types in ${JSON.stringify(
          validValues,
        )}. Got "${value}".`,
      );
    }
  }

  /**
   * Checks if a number is within a specified range.
   *
   * @param num - The number to check.
   * @param min - The minimum value of the range.
   * @param max - The maximum value of the range.
   * @param argumentName - The name of the argument being checked.
   * @returns A Result indicating whether the number is within the specified range.
   */
  public static inRange(
    num: number,
    min: number,
    max: number,
    argumentName: string,
  ): Result<GuardResponse> {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return Result.fail<GuardResponse>(
        `${argumentName} is not within range ${min} to ${max}.`,
      );
    } else {
      return Result.ok<GuardResponse>();
    }
  }

  /**
   * Checks if a number is within a specified range.
   *
   * @param numbers - The list of numbers to check.
   * @param min - The minimum value of the range.
   * @param max - The maximum value of the range.
   * @param argumentName - The name of the argument being checked.
   * @returns A Result indicating whether all of the numbers are within the specified range.
   */
  public static allInRange(
    numbers: number[],
    min: number,
    max: number,
    argumentName: string,
  ): Result<GuardResponse> {
    let failingResult: Result<GuardResponse> = null;

    for (const num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);
      if (!numIsInRangeResult.isFailure) failingResult = numIsInRangeResult;
    }

    if (failingResult) {
      return Result.fail<GuardResponse>(
        `${argumentName} is not within the range.`,
      );
    } else {
      return Result.ok<GuardResponse>();
    }
  }
}
