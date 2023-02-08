import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify/adapters';
import { PrismaClient } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';

describe('UserController (e2e)', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [],
      imports: [AppModule],
      providers: [],
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

  type PayloadProps = {
    name: string;
    email: string;
    password: string;
    document: string;
    accessLevel: string;
  };

  describe('/POST Create User', () => {
    it('should error create user if name invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/users',
          headers: { companyid: randomUUID() },
          payload: {
            name: 'PD',
            email: 'client@mail.com',
            document: '00.000.000/0001-11',
            password: 'Dv_@8246',
            accessLevel: 'CLIENT',
          } as PayloadProps,
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('should error create user if email invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/users',
          headers: { companyid: randomUUID() },
          payload: {
            name: 'Prodata Client',
            email: 'client@mail',
            document: '00.000.000/0001-11',
            password: 'Dv_@8246',
            accessLevel: 'CLIENT',
          } as PayloadProps,
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('should error create user if document invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/users',
          headers: { companyid: randomUUID() },
          payload: {
            name: 'Prodata Client',
            email: 'client@mail.com',
            document: '00.000.000/-11',
            password: 'Dv_@8246',
            accessLevel: 'CLIENT',
          } as PayloadProps,
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('should error create user if password invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/users',
          headers: { companyid: randomUUID() },
          payload: {
            name: 'Prodata Client',
            email: 'client@mail.com',
            document: '00.000.000/0001-11',
            password: 'Dv@',
            accessLevel: 'CLIENT',
          } as PayloadProps,
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('should error create user if companyId invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/users',
          headers: { companyid: '' },
          payload: {
            name: 'Prodata Client',
            email: 'client@mail.com',
            document: '00.000.000/0001-11',
            password: 'Dv_@8246',
            accessLevel: 'CLIENT',
          } as PayloadProps,
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);
        });
    });

    it('should error create user if company is not exists', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/users',
          headers: { companyid: randomUUID() },
          payload: {
            name: 'Prodata Client',
            email: 'client@mail.com',
            document: '00.000.000/0001-11',
            password: 'Dv_@8246',
            accessLevel: 'CLIENT',
          } as PayloadProps,
        })
        .then((result) => {
          expect(result.statusCode).toBe(401);
        });
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});
