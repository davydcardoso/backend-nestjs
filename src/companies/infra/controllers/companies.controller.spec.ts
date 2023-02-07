import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { CompaniesController } from './companies.controller';

describe('CompaniesController', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      imports: [AppModule],
    }).compile();

    prisma = new PrismaClient();

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(prisma).toBeDefined();
  });

  const data = {
    name: 'Prodata Informatica',
    email: 'prodata@test.com',
    document: '00.000.000/0001-11',
  };

  it('/POST - Create Company: Testing create company with name invalid', async () => {
    return app
      .inject({
        method: 'POST',
        path: '/companies',
        payload: {
          ...data,
          name: '',
        },
      })
      .then(async (result) => {
        expect(result.statusCode).toBe(400);
      });
  });

  it('/POST - Create Company: Testing create company with email invalid', async () => {
    return app
      .inject({
        method: 'POST',
        path: '/companies',
        payload: {
          ...data,
          email: 'test@test',
        },
      })
      .then((result) => {
        expect(result.statusCode).toBe(400);
      });
  });

  it('/POST - Create Company: Testing create company with document invalid', async () => {
    return app
      .inject({
        method: 'POST',
        path: '/companies',
        payload: {
          ...data,
          document: '0003365',
        },
      })
      .then((result) => {
        expect(result.statusCode).toBe(400);
      });
  });

  it('/POST - Create company: Testing create company with account already exists', async () => {
    await prisma.companies.create({
      data: { ...data, email: 'prodata@teste2.com' },
    });

    app
      .inject({
        method: 'POST',
        path: '/companies',
        payload: { ...data, email: 'prodata@teste2.com' },
      })
      .then(async (result) => {
        expect(result.statusCode).toBe(400);

        return await prisma.companies.delete({
          where: { email: 'prodata@teste2.com' },
        });
      });
  });

  it('/POST - Create Company: Testing create company with success', async () => {
    return app
      .inject({
        method: 'POST',
        path: '/companies',
        payload: { ...data },
      })
      .then(async (result) => {
        const user = await prisma.companies.findUnique({
          where: { email: data.email },
        });

        expect(result.statusCode).toBe(201);
        expect(user).toBeTruthy();
      });
  });

  afterAll(async () => {
    await prisma.companies
      .delete({ where: { email: 'prodata@test.com' } })
      .catch((err) => {});

    await prisma.$disconnect();
    await app.close();
  });
});
