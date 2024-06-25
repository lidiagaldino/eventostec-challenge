import { Guard } from '../shared/guard/guard';
import { Result } from '../shared/result/result';

export type TUrlProps = {
  url: string;
};

/**
 * Represents a url value object.
 */
export class Url {
  private props: TUrlProps;

  /**
   * Private constructor for creating a Url instance.
   * @param props - The properties of the url.
   */
  private constructor(props: TUrlProps) {
    this.props = props;
  }

  /**
   * Creates a new Url instance.
   * @param props - The properties of the url.
   * @returns A Result object containing the created Url instance or an error.
   */
  public static create(props: TUrlProps): Result<Url> {
    const guardResult = Guard.againstNullOrUndefined(props.url, 'url');
    if (guardResult.isFailure || !Url.isUrlValid(props.url))
      return Result.fail<Url>(
        guardResult.getErrorValue()
          ? guardResult.getErrorValue()
          : 'Invalid URL',
      );
    return Result.ok<Url>(new Url(props));
  }

  public static isUrlValid(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  /**
   * Gets the URL of the url.
   * @returns The URL of the url.
   */
  getUrl() {
    return this.props.url;
  }
}
