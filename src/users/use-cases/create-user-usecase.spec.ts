import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user-usecase';
import { InvalidNameUserError } from '../domain/entity/errors/invalid-name-user.error';
import { InvalidUserEmailError } from '../domain/entity/errors/invalid-user-email.error';
import { InvalidPasswordUserError } from '../domain/entity/errors/invalid-password-user.error';
import { UserRepositoryPrisma } from '../infra/repositories/user.repository.prisma';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from '../infra/repositories/user.repository';
import { PrismaClient } from '@prisma/client';
import { InvalidUserDocumentError } from '../domain/entity/errors/invalid-user-document.error';
import { InvalidUserAccessLevelError } from '../domain/entity/errors/invalid-user-accesslevel.error';

describe('CreateUserUseCase', () => {
  let prisma: PrismaClient;
  let usecase: CreateUserUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateUserUseCase],
      imports: [PrismaModule],
      providers: [
        {
          provide: UserRepository,
          useClass: UserRepositoryPrisma,
        },
      ],
    }).compile();

    prisma = new PrismaClient();

    await prisma.companies.create({
      data: {
        id: '9d37a455-d8d3-48f1-a1cd-124ca95f7369',
        name: 'Prodata Informatica',
        email: 'dev@prodata.com',
        document: '00.000.000/0001-11',
        createdAt: new Date(),
      },
    });

    usecase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  const companyId = '9d37a455-d8d3-48f1-a1cd-124ca95f7369';

  const data = {
    name: 'Prodata Informatica',
    email: 'prodata@mail.com',
    password: 'Dv@_7469',
    document: '00.000.000/0010-11',
    accessLevel: 'CLIENT',
    companyId,
  };

  it('Obects success constructeds', () => {
    expect(usecase).toBeDefined();
  });

  it('Create User: Testing create account with name is invalid', async () => {
    const result = await usecase.perform({ ...data, name: '' });

    expect(result.value as Error).toEqual(new InvalidNameUserError());
  });

  it('Create User: Testing create account with email is invalid', async () => {
    const resultTest1 = await usecase.perform({ ...data, email: '' });
    expect(resultTest1.value as Error).toEqual(new InvalidUserEmailError(''));

    const resultTest2 = await usecase.perform({ ...data, email: 'est@mail' });
    expect(resultTest2.value as Error).toEqual(
      new InvalidUserEmailError('est@mail'),
    );
  });

  it('Create User: Testing create account with password invalid', async () => {
    const resultTest1 = await usecase.perform({ ...data, password: '12345' });
    expect(resultTest1.value as Error).toEqual(new InvalidPasswordUserError());

    const resultTest2 = await usecase.perform({ ...data, password: 'dv@7469' });
    expect(resultTest2.value as Error).toEqual(new InvalidPasswordUserError());
  });

  it('Create User: Testing create account with document invalid', async () => {
    const resultTest1 = await usecase.perform({ ...data, document: '' });
    expect(resultTest1.value as Error).toEqual(new InvalidUserDocumentError());

    const resultTest2 = await usecase.perform({
      ...data,
      document: '00.000.000./0001-11',
    });
    expect(resultTest2.value as Error).toEqual(new InvalidUserDocumentError());
  });

  it('Create User: Testing create account with access level invalid', async () => {
    const resultTest1 = await usecase.perform({ ...data, accessLevel: '' });
    expect(resultTest1.value as Error).toEqual(
      new InvalidUserAccessLevelError(),
    );

    const resultTest2 = await usecase.perform({
      ...data,
      accessLevel: 'USUARIO',
    });
    expect(resultTest2.value as Error).toEqual(
      new InvalidUserAccessLevelError(),
    );
  });

  it('Create User: Testing create account with company id invalid', async () => {
    const resultTest1 = await usecase.perform({ ...data, companyId: '' });
    expect(resultTest1.value as Error).toEqual(new Error());
  });

  afterAll(async () => prisma.$disconnect());
});
