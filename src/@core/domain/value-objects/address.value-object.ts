import { Guard } from '../shared/guard/guard';
import { Result } from '../shared/result/result';

export type TAddressProps = {
  city: string;
  uf: string;
};

export class Address {
  private props: TAddressProps;

  private constructor(props: TAddressProps) {
    this.props = props;
  }

  public static create(address: TAddressProps): Result<Address> {
    const guardResults = Guard.combine([
      Guard.againstNullOrUndefined(address.city, 'city'),
      Guard.againstNullOrUndefined(address.uf, 'uf'),
      Guard.againstAtLeast(2, address?.city),
      Guard.againstAtLeast(2, address?.uf),
      Guard.againstAtMost(2, address?.uf),
    ]);
    if (guardResults.isFailure)
      return Result.fail<Address>(guardResults.getErrorValue());

    return Result.ok<Address>(new Address(address));
  }

  getUf() {
    return this.props.uf;
  }

  getCity() {
    return this.props.city;
  }
}
