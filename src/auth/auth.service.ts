import { Injectable } from '@nestjs/common';
import { Either, left, right } from 'src/core/logic/Either';

import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';

import { User } from 'src/users/domain/entity/users/user.entity';
import { Document } from 'src/users/domain/entity/users/document';
import { Password } from 'src/users/domain/entity/users/password';

import { AccessLevel as AccessLevelPersistence } from '@prisma/client';

import { CompanyIsNotExistsError } from './errors/company-is-not-exists.error';
import { UserAccountNotExistsError } from './errors/user-account-not-exists.error';
import { CompanyAccountNotActivedError } from './errors/company-account-not-actived.error';
import { JwtService } from '@nestjs/jwt';
import { PasswordIsNotCompareError } from './errors/password-is-not-compare.error';

type GenerateTokenResponseProps = {
  user: {
    name: string;
    email: string;
    document: string;
    companyId: string;
    accessLevel: string;
  };
  accessToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UserRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Either<Error, User>> {
    const documentOrError = Document.create(username);
    const passwordOrError = Password.create(password);

    if (documentOrError.isLeft()) {
      return left(documentOrError.value);
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const document = documentOrError.value;

    const user = await this.usersRepository.getByDocument(document.value);

    if (!user) {
      return left(new UserAccountNotExistsError());
    }

    const passwordCorrect = await user.password.comparePassword(password);

    if (!passwordCorrect) {
      return left(new PasswordIsNotCompareError());
    }

    const company = await this.companyRepository.getById(user.companyId);

    if (!company) {
      return left(new CompanyIsNotExistsError());
    }

    if (!company.status) {
      return left(new CompanyAccountNotActivedError());
    }

    return right(user);
  }

  async generateToken(
    payload: User,
  ): Promise<Either<Error, GenerateTokenResponseProps>> {
    const { name, email, document, companyId, accessLevel } = payload;

    const accessToken = this.jwtService.sign({
      userId: payload.id,
      companyId: payload.companyId,
    });

    return right({
      accessToken,
      user: {
        name: name.value,
        email: email.value,
        companyId: companyId,
        document: document.value,
        accessLevel: AccessLevelPersistence[accessLevel.value],
      },
    });
  }
}
