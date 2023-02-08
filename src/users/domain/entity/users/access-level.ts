import { Either, left, right } from 'src/core/logic/Either';
import { InvalidUserAccessLevelError } from '../errors/invalid-user-accesslevel.error';

export enum AccessLevelProps {
  DEVELOPER,
  ADMINISTRATOR,
  SUPORT,
  CLIENT,
}

export class AccessLevel {
  private readonly accessLevel: string;

  get value() {
    return this.accessLevel;
  }

  private constructor(value: string) {
    this.accessLevel = value;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length < 5 || value.trim().length > 255) {
      return false;
    }

    if (AccessLevelProps[value] === undefined) {
      return false;
    }

    return true;
  }

  static create(
    value: string,
  ): Either<InvalidUserAccessLevelError, AccessLevel> {
    if (!this.validate(value)) {
      return left(new InvalidUserAccessLevelError());
    }

    return right(new AccessLevel(value));
  }
}
