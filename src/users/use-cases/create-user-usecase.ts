import { Injectable } from '@nestjs/common/decorators';
import { UseCase } from 'src/core/domain/use-case';

import { Either, left, right } from 'src/core/logic/either';

import { InvalidNameUserError } from '../domain/entity/errors/invalid-name-user.error';
import { InvalidUserEmailError } from '../domain/entity/errors/invalid-user-email.error';
import { InvalidPasswordUserError } from '../domain/entity/errors/invalid-password-user.error';

import { User } from '../domain/entity/users/user.entity';
import { Name } from '../domain/entity/users/name';
import { Email } from '../domain/entity/users/email';
import { Password } from '../domain/entity/users/password';
import { Document } from '../domain/entity/users/document';
import { AccessLevel } from '../domain/entity/users/access-level';

import { UserRepository } from '../infra/repositories/user.repository';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';

import { AlreadyExistsUserAccountError } from './errors/already-exists-user-account.error';
import { CompanyNotExistsError } from './errors/company-not-exists.error';
import { CompanyAccountIsNotActivedError } from './errors/company-account-is-not-actived.error';
import { CompanyIdNotFoundError } from './errors/company-id-not-found.error';

type CreateUserUseCaseProps = {
  name: string;
  email: string;
  password: string;
  document: string;
  accessLevel: string;
  companyId: string;
};

type CreateUserUseCaseResponse = Either<Error, CreateUserUseCaseResponseProps>;

type CreateUserUseCaseResponseProps = {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    document: string;
    accessLevel: string;
  };
};
@Injectable()
export class CreateUserUseCase implements UseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly companiesRepository: CompanyRepository,
  ) {}

  async perform({
    name,
    email,
    document,
    password,
    companyId,
    accessLevel,
  }: CreateUserUseCaseProps): Promise<CreateUserUseCaseResponse> {
    const nameOrError = Name.create(name);
    const emailOrError = Email.create(email);
    const passwordOrError = Password.create(password);
    const documentOrError = Document.create(document);
    const accessLevelOrError = AccessLevel.create('CLIENT');

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    if (documentOrError.isLeft()) {
      return left(documentOrError.value);
    }

    if (accessLevelOrError.isLeft()) {
      return left(accessLevelOrError.value);
    }

    if (
      !companyId ||
      companyId.trim().length < 5 ||
      companyId.trim().length > 255
    ) {
      return left(new CompanyIdNotFoundError());
    }

    const userOrError = User.create({
      companyId,
      name: nameOrError.value,
      email: emailOrError.value,
      password: passwordOrError.value,
      document: documentOrError.value,
      accessLevel: accessLevelOrError.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const company = await this.companiesRepository.getById(companyId);

    if (!company) {
      return left(new CompanyNotExistsError());
    }

    if (!company.status) {
      return left(new CompanyAccountIsNotActivedError());
    }

    const user = userOrError.value;

    const alreadyExistsUser = await this.userRepository.getByEmail(
      user.email.value,
    );

    if (alreadyExistsUser) {
      return left(new AlreadyExistsUserAccountError());
    }

    await this.userRepository.create(user);

    return right({
      message: 'Usuário criado no sistema com sucesso',
      user: {
        id: user.id,
        name: user.name.value,
        email: user.email.value,
        document: user.document.value,
        accessLevel: user.accessLevel.value,
      },
    });
  }
}
