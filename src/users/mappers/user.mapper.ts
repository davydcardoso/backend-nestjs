import { Injectable } from '@nestjs/common';
import {
  Users as UserPersistence,
  AccessLevel as AccessLevelPersistence,
} from '@prisma/client';
import { Mapper } from 'src/core/domain/mapper';
import { AccessLevel } from '../domain/entity/users/access-level';
import { Document } from '../domain/entity/users/document';
import { Email } from '../domain/entity/users/email';
import { Name } from '../domain/entity/users/name';
import { Password } from '../domain/entity/users/password';
import { User } from '../domain/entity/users/user.entity';

export class UserMapper extends Mapper<User, UserPersistence> {
  toDomain(raw: UserPersistence): User {
    const nameOrError = Name.create(raw.name);
    const emailOrError = Email.create(raw.email);
    const passwordOrError = Password.create(raw.password, true);
    const documentOrError = Document.create(raw.document);
    const accessLevelOrError = AccessLevel.create(raw.accessLevel);

    if (nameOrError.isLeft()) {
      throw new Error('Name value is invalid.');
    }

    if (emailOrError.isLeft()) {
      throw new Error('Email value is invalid.');
    }

    if (passwordOrError.isLeft()) {
      throw new Error('Password value is invalid.');
    }

    if (documentOrError.isLeft()) {
      throw new Error('Document value is invalid');
    }

    if (accessLevelOrError.isLeft()) {
      throw new Error('Access level value is invalid');
    }

    const userOrError = User.create(
      {
        name: nameOrError.value,
        email: emailOrError.value,
        password: passwordOrError.value,
        document: documentOrError.value,
        companyId: raw.companiesId,
        accessLevel: accessLevelOrError.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      raw.id,
    );

    if (userOrError.isRight()) {
      return userOrError.value;
    }

    return null;
  }

  async toPersistence(raw: User): Promise<UserPersistence> {
    return {
      id: raw.id,
      name: raw.name.value,
      email: raw.email.value,
      password: await raw.password.getHashedValue(),
      accessLevel: AccessLevelPersistence[raw.accessLevel.value],
      document: raw.document.value,
      companiesId: raw.companyId,
      createdAt: raw.createAt,
      updatedAt: raw.updatedAt,
    };
  }
}
