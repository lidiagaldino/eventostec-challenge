import { Either } from './either.result';
import { Left } from './left.result';

/**
 * Represents a right value in a Result type.
 * @template L - The type of the left value.
 * @template A - The type of the right value.
 */
export class Right<L, A> {
  readonly value: A;

  /**
   * Creates a new instance of the Right class.
   * @param value - The value of the right side.
   */
  constructor(value: A) {
    this.value = value;
  }

  /**
   * Checks if the result is a Left value.
   * @returns False, indicating that it is not a Left value.
   */
  isLeft(): this is Left<L, A> {
    return false;
  }

  /**
   * Checks if the result is a Right value.
   * @returns True, indicating that it is a Right value.
   */
  isRight(): this is Right<L, A> {
    return true;
  }

  /**
   * Gets the value of the Right.
   * @returns The value of the Right.
   */
  get _value(): A {
    return this.value;
  }
}

export const right = <L, A>(a: A): Either<L, A> => {
  return new Right<L, A>(a);
};
