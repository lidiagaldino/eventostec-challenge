import { Either } from './either.result';
import { Result } from './result';

export type Response<T> = Either<Result<any>, Result<T>>;
