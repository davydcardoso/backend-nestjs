import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { AppModule } from 'src/app.module';

describe('CompaniesController (e2e)', () => {
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

  it('/POST: should error 400 if body is invalid', async () => {
    app
      .inject({
        method: 'POST',
        path: '/companies',
        payload: {
          name: 'Prodata Informatica',
          email: 'prodata-test1@mail.com',
          document: '000',
        },
      })
      .then((result) => {});
  });

  afterAll(async () => {
    await app.close();
  });
});
