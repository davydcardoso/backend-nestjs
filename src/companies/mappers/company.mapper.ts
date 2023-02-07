import { Companies as CompanyPersistence } from '@prisma/client';
import { Mapper } from 'src/core/domain/mapper';
import { CompanyEntity } from '../domain/entity/companies/companies';
import { Document } from '../domain/entity/companies/document';
import { Email } from '../domain/entity/companies/email';
import { Name } from '../domain/entity/companies/name';

export class CompanyMapper extends Mapper<CompanyEntity, CompanyPersistence> {
  toDomain(raw: CompanyPersistence): CompanyEntity {
    const nameOrError = Name.create(raw.name);
    const emailOrError = Email.create(raw.email);
    const documentOrError = Document.create(raw.document);

    if (nameOrError.isLeft()) {
      throw new Error('Company name is invalid');
    }

    if (emailOrError.isLeft()) {
      throw new Error('Company email is invalid');
    }

    if (documentOrError.isLeft()) {
      throw new Error('Company document is invalid');
    }

    const companyOrError = CompanyEntity.create(
      {
        name: nameOrError.value,
        email: emailOrError.value,
        document: documentOrError.value,
        isEnabled: raw.isEnabled,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      raw.id,
    );

    if (companyOrError.isRight()) {
      return companyOrError.value;
    }

    return null;
  }

  async toPersistence(raw: CompanyEntity): Promise<CompanyPersistence> {
    return {
      id: raw.id,
      name: raw.name.value,
      email: raw.email.value,
      document: raw.document.value,
      isEnabled: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
