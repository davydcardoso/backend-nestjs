import { Entity } from 'src/core/domain/entity';
import { Either, right } from 'src/core/logic/Either';
import { AccessLevel } from './access-level';
import { Document } from './document';
import { Email } from './email';
import { Name } from './name';
import { Password } from './password';

type UserProps = {
  name: Name;
  email: Email;
  password: Password;
  document: Document;
  companyId: string;
  accessLevel: AccessLevel;
  createdAt?: Date;
  updatedAt: Date;
};

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get document() {
    return this.props.document;
  }

  get companyId() {
    return this.props.companyId;
  }

  get accessLevel() {
    return this.props.accessLevel;
  }

  get createAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  static create(props: UserProps, id?: string): Either<Error, User> {
    const user = new User(props, id);

    return right(user);
  }
}
