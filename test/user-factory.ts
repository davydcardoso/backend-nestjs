import { sign } from 'jsonwebtoken';

import { AccessLevel as AccessLevelPersistence } from '@prisma/client';

import { User } from 'src/users/domain/entity/users/user.entity';

import { Name } from 'src/users/domain/entity/users/name';
import { Email } from 'src/users/domain/entity/users/email';
import { Document } from 'src/users/domain/entity/users/document';
import { Password } from 'src/users/domain/entity/users/password';
import { AccessLevel } from 'src/users/domain/entity/users/access-level';
import { randomUUID } from 'crypto';
import { COMPANY_ADMIN_ID, USER_ADMIN_ID_1 } from 'src/prisma/seed.constants';

export function createAndAuthenticateUser() {
  const name = Name.create('John Doe').value as Name;
  const email = Email.create('johndoe@example.com').value as Email;
  const password = Password.create('Dv@_8246').value as Password;
  const document = Document.create('000.000.000-11').value as Document;
  const accessLevel = AccessLevel.create('CLIENT').value as AccessLevel;

  const user = User.create(
    {
      name,
      email,
      password,
      document,
      accessLevel,
      companyId: COMPANY_ADMIN_ID,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    USER_ADMIN_ID_1,
  ).value as User;

  const accessToken = sign(
    { userId: user.id, companyId: user.companyId },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '30d' },
  );

  return {
    accessToken,
    user: {
      name: name.value,
      email: email.value,
      companyId: user.companyId,
      document: document.value,
      accessLevel: AccessLevelPersistence[accessLevel.value],
    },
  };
}
