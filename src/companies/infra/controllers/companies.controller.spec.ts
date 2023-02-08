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

  describe("/POST Create Company", () => {
    it('should error 400 if document is invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/companies',
          payload: {
            name: 'Prodata Informatica',
            email: 'prodata-test1@mail.com',
            document: '000',
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('should error 400 if email is invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/companies',
          payload: {
            name: 'Prodata Informatica',
            email: 'prodata-test2@mail',
            document: '00.000.000/0001-11',
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('should error 400 if name is invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/companies',
          payload: {
            name: 'PD',
            email: 'prodata-test2@mail',
            document: '00.000.000/0001-11',
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });
  })

  afterAll(async () => {
    await app.close();
  });
});
