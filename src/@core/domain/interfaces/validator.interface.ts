export interface IValidator<T> {
  validate(schema: any, props: T): TValidationOutput;
}

export type TValidationOutput = {
  isValid: boolean;
  errorsResult?: string;
};
