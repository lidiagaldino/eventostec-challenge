
import { SchemaOf, ValidationError } from 'yup';
import {
  IValidator,
  TValidationOutput,
} from '../../../domain/interfaces/validator.interface';

export class YupAdapter implements IValidator<unknown> {
  validate(schema: SchemaOf<any>, props: any): TValidationOutput {
    const errorsResult: Record<string, Record<string, string>> = {};

    try {
      schema.validateSync(props, { abortEarly: false });
    } catch (error) {
      const yuperror = error as ValidationError;
      const errors: Record<string, string> = {};
      console.log(error)

      yuperror.inner.forEach((e) => {
        if (!e.path) return;

        errors[e.path] = e.message;
      });
      errorsResult.errors = errors;
    }

    if (Object.entries(errorsResult).length === 0) {
      return { isValid: true };
    } else {
      return { isValid: false, errorsResult: JSON.stringify(errorsResult) };
    }
  }
}
