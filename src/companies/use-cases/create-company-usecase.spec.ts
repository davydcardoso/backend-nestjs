import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaModule } from '../../prisma/prisma.module';
import { InvalidCompanyDocumentError } from '../domain/errors/invalid-company-document.error';
import { InvalidCompanyEmailError } from '../domain/errors/invalid-company-email.error';
import { InvalidCompanyNameError } from '../domain/errors/invalid-company-name.error';
import { CompanyRepository } from '../infra/repositories/company.repository';
import { CompanyRepositoryPrisma } from '../infra/repositories/company.repository.prisma';
import { CreateCompanyUseCase } from './create-company-usecase';
import { AlreadyExistsCompanyAccountWithThisAddressEmailError } from './errors/already-exists-company-account-with-this-address-email.error';
import { AlreadyExistsCompanyAccountWithThisDocumentError } from './errors/already-exists-company-account-with-this-document.error';

describe('CreateCompanyUseCase', () => {
  let usecase: CreateCompanyUseCase;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateCompanyUseCase],
      imports: [PrismaModule],
      providers: [
        {
          provide: CompanyRepository,
          useClass: CompanyRepositoryPrisma,
        },
      ],
    }).compile();

    prisma = new PrismaClient();

    usecase = module.get<CreateCompanyUseCase>(CreateCompanyUseCase);
  });

  it('Test with class constructed', () => {
    expect(prisma).toBeDefined();
    expect(usecase).toBeDefined();
  });

  const data = {
    name: 'Prodata',
    email: 'prodata@testcreatecompany.com',
    document: '00.000.000/0001-11',
  };

  describe('Create Company: Testing usecases with payload', () => {
    it('Create Company: Testing create company with company name invalid', async () => {
      const resultWithNameIsNull = await usecase.perform({
        ...data,
        name: null,
      });

      const resultWithNameIsEmpty = await usecase.perform({
        ...data,
        name: '',
      });

      const resultWithNameError = await usecase.perform({
        ...data,
        name: 'PD',
      });

      expect(resultWithNameIsNull.value as Error).toEqual(
        new InvalidCompanyNameError(),
      );
      expect(resultWithNameIsEmpty.value as Error).toEqual(
        new InvalidCompanyNameError(),
      );
      expect(resultWithNameError.value as Error).toEqual(
        new InvalidCompanyNameError(),
      );
    });

    it('Create Company: Testing create company with email invalid', async () => {
      const resulWithEmailIsNull = await usecase.perform({
        ...data,
        email: null,
      });

      const resultWithEmailIsEmpty = await usecase.perform({
        ...data,
        email: '',
      });

      const resultWithEmailFormatInvalid = await usecase.perform({
        ...data,
        email: 'company@mail',
      });

      expect(resulWithEmailIsNull.value as Error).toEqual(
        new InvalidCompanyEmailError(),
      );
      expect(resultWithEmailIsEmpty.value as Error).toEqual(
        new InvalidCompanyEmailError(),
      );
      expect(resultWithEmailFormatInvalid.value as Error).toEqual(
        new InvalidCompanyEmailError(),
      );
    });

    it('Create Company: Testing create company with document invalid', async () => {
      const resultWithDocumentNull = await usecase.perform({
        ...data,
        document: null,
      });

      const resultWithDocumentEmpty = await usecase.perform({
        ...data,
        document: '',
      });

      const resultWithDocumentInvalid = await usecase.perform({
        ...data,
        document: '00.000.00/0001-11',
      });

      expect(resultWithDocumentNull.value as Error).toEqual(
        new InvalidCompanyDocumentError(),
      );
      expect(resultWithDocumentEmpty.value as Error).toEqual(
        new InvalidCompanyDocumentError(),
      );
      expect(resultWithDocumentInvalid.value as Error).toEqual(
        new InvalidCompanyDocumentError(),
      );
    });
  });

  it('Create Company: Testing create company in case success', async () => {
    const result = await usecase.perform({ ...data });

    expect(result.isLeft()).toBe(false);
    expect(result.value as Error).toEqual({});
    expect(result.value as object).toBeTruthy();
  });

  it('Create Company: testing create company in case account already exists', async () => {
    const resultErrorEmailAlreadyExists = await usecase.perform({
      ...data,
      document: '000.000.000-18',
    });
    expect(resultErrorEmailAlreadyExists.value as Error).toEqual(
      new AlreadyExistsCompanyAccountWithThisAddressEmailError(),
    );

    const resultErrorDocumentAlreadyExists = await usecase.perform({
      ...data,
      email: 'prodata@teste2.com',
    });
    expect(resultErrorDocumentAlreadyExists.value as Error).toEqual(
      new AlreadyExistsCompanyAccountWithThisDocumentError(),
    );
  });

  afterAll(async () => {
    await 
    await prisma.$disconnect();
  });
});
