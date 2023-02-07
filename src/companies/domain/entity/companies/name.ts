import { Either, left, right } from 'src/core/logic/Either';
import { InvalidCompanyNameError } from '../../errors/invalid-company-name.error';

export class Name {
  private readonly name: string;

  get value() {
    return this.name;
  }

  private constructor(value: string) {
    this.name = value;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length < 3 || value.trim().length > 255) {
      return false;
    }

    return true;
  }

  static create(value: string): Either<InvalidCompanyNameError, Name> {
    if (!this.validate(value)) {
      return left(new InvalidCompanyNameError());
    }

    return right(new Name(value));
  }
}
