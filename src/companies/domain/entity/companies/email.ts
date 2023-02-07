import { Either, left, right } from 'src/core/logic/Either';
import { InvalidCompanyEmailError } from '../../errors/invalid-company-email.error';

export class Email {
  private readonly email: string;

  get value() {
    return this.email;
  }

  private constructor(value: string) {
    this.email = value;
  }

  static validate(value: string) {
    if (!value || value.trim().length < 5 || value.trim().length > 255) {
      return false;
    }

    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!regex.test(value)) {
      return false;
    }

    return true;
  }

  static create(value: string): Either<InvalidCompanyEmailError, Email> {
    if (!this.validate(value)) {
      return left(new InvalidCompanyEmailError());
    }

    return right(new Email(value));
  }
}
