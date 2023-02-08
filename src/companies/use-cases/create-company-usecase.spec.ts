import { PrismaModule } from '../../prisma/prisma.module';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateCompanyUseCase } from './create-company-usecase';

import { CompanyRepository } from '../infra/repositories/company.repository';
import { CompanyRepositoryInMemory } from '../infra/repositories/company.repository.in-memory';

import { InvalidCompanyNameError } from '../domain/errors/invalid-company-name.error';
import { InvalidCompanyEmailError } from '../domain/errors/invalid-company-email.error';
import { InvalidCompanyDocumentError } from '../domain/errors/invalid-company-document.error';
import { AlreadyExistsCompanyAccountWithThisDocumentError } from './errors/already-exists-company-account-with-this-document.error';
import { AlreadyExistsCompanyAccountWithThisAddressEmailError } from './errors/already-exists-company-account-with-this-address-email.error';

describe('CreateCompanyUseCase', () => {
  let usecase: CreateCompanyUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateCompanyUseCase],
      imports: [PrismaModule],
      providers: [
        {
          provide: CompanyRepository,
          useClass: CompanyRepositoryInMemory,
        },
      ],
    }).compile();

    usecase = module.get<CreateCompanyUseCase>(CreateCompanyUseCase);
  });

  it('Test with class constructed', () => {
    expect(usecase).toBeDefined();
  });

  const data = {
    name: 'Prodata',
    email: 'prodata@testcreatecompany.com',
    document: '00.000.000/0001-11',
  };

  it('Should return object if CreateCompanyUseCase Right == true', async () => {
    const result = await usecase.perform({ ...data });

    expect(result.isRight()).toBe(true);
    expect(result.value as object).toEqual({});
  });

  it('Shoul return Error if CreateCompanyUseCase Left == true', async () => {
    const resultTest1 = await usecase.perform({ ...data, name: '' });
    expect(resultTest1.isLeft()).toBe(true);
    expect(resultTest1.value as Error).toEqual(new InvalidCompanyNameError());

    const resultTest2 = await usecase.perform({ ...data, email: '' });
    expect(resultTest2.isLeft()).toBe(true);
    expect(resultTest2.value as Error).toEqual(new InvalidCompanyEmailError());

    const resultTest3 = await usecase.perform({ ...data, document: '' });
    expect(resultTest3.isLeft()).toBe(true);
    expect(resultTest3.value as Error).toEqual(
      new InvalidCompanyDocumentError(),
    );
  });

  it('Should return Error if CreateCompanyUseCase Left == true', async () => {
    const resultTest1 = await usecase.perform({ ...data, name: 'PD' });
    expect(resultTest1.isLeft()).toBe(true);
    expect(resultTest1.value as Error).toEqual(new InvalidCompanyNameError());

    const resultTest2 = await usecase.perform({ ...data, email: 'test@mail' });
    expect(resultTest2.isLeft()).toBe(true);
    expect(resultTest2.value as Error).toEqual(new InvalidCompanyEmailError());

    const resultTest3 = await usecase.perform({ ...data, document: '2225333' });
    expect(resultTest3.isLeft()).toBe(true);
    expect(resultTest3.value as Error).toEqual(
      new InvalidCompanyDocumentError(),
    );
  });

  it('Should return object if CreateCompanyUseCase is right == true', async () => {
    const result = await usecase.perform({ ...data });
    expect(result.isRight()).toBe(true);
    expect(result.value as object).toEqual({});
  });
});
