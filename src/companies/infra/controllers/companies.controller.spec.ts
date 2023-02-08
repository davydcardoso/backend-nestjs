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

  const data = {
    name: 'Prodata Informatica',
    email: 'prodata@test.com',
    document: '00.000.000/0001-11',
  };

  afterAll(async () => {
    await app.close();
  });
});
