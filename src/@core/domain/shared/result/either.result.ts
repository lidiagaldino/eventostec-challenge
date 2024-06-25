import { Left } from './left.result';
import { Right } from './right.result';

export type Either<L, A> = Left<L, A> | Right<L, A>;
