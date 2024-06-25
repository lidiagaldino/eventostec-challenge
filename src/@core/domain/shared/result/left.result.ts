import { Either } from './either.result';
import { Right } from './right.result';

/**
 * Represents the left side of a result, containing an error value.
 * @template L - The type of the error value.
 * @template A - The type of the success value.
 */
export class Left<L, A> {
  readonly value: L;

  /**
   * Creates a new instance of the Left class.
   * @param value - The error value.
   */
  constructor(value: L) {
    this.value = value;
  }

  /**
   * Checks if the result is on the left side.
   * @returns True if the result is on the left side, false otherwise.
   */
  isLeft(): this is Left<L, A> {
    return true;
  }

  /**
   * Checks if the result is on the right side.
   * @returns False since this is the Left class.
   */
  isRight(): this is Right<L, A> {
    return false;
  }

  /**
   * Gets the error value.
   * @returns The error value.
   */
  get _value(): L {
    return this.value;
  }
}

export const left = <L, A>(l: L): Either<L, A> => {
  return new Left(l);
};
