import { Injectable } from '@nestjs/common';

import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';

import { Name } from '../domain/entity/companies/name';
import { Email } from '../domain/entity/companies/email';
import { Document } from '../domain/entity/companies/document';
import { CompanyEntity } from '../domain/entity/companies/companies';
import { CompanyRepository } from '../infra/repositories/company.repository';

import { AlreadyExistsCompanyAccountWithThisAddressEmailError } from './errors/already-exists-company-account-with-this-address-email.error';
import { AlreadyExistsCompanyAccountWithThisDocumentError } from './errors/already-exists-company-account-with-this-document.error';

type CreateCompanyUseCaseRequest = {
  name: string;
  email: string;
  document: string;
};

type CreateCompanyUseCaseResponse = Either<Error, object>;

@Injectable()
export class CreateCompanyUseCase implements UseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async perform({
    name,
    email,
    document,
  }: CreateCompanyUseCaseRequest): Promise<CreateCompanyUseCaseResponse> {
    const nameOrError = Name.create(name);
    const emailOrError = Email.create(email);
    const documentOrError = Document.create(document);

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (documentOrError.isLeft()) {
      return left(documentOrError.value);
    }

    const companyOrError = CompanyEntity.create({
      name: nameOrError.value,
      email: emailOrError.value,
      document: documentOrError.value,
      isEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (companyOrError.isLeft()) {
      return left(companyOrError.value);
    }

    const company = companyOrError.value;

    const alreadyExistsCompanyByEmail = await this.companyRepository.getByEmail(
      company.email.value,
    );

    if (alreadyExistsCompanyByEmail) {
      return left(new AlreadyExistsCompanyAccountWithThisAddressEmailError());
    }

    const alreadyExistsCompanyByDocument =
      await this.companyRepository.getByDocument(company.document.value);

    if (alreadyExistsCompanyByDocument) {
      return left(new AlreadyExistsCompanyAccountWithThisDocumentError());
    }

    await this.companyRepository.create(company);

    return right({});
  }
}
