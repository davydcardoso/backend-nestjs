import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from 'src/app.module';

import { FastifyAdapter } from '@nestjs/platform-fastify/adapters';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { createAndAuthenticateUser } from '../../../../test/user-factory';

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

  type ResponseBodyError = {
    message: string;
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

  describe('/POST Get Account data ', () => {
    it('should error if request authorization header not informed', async () => {
      return app
        .inject({
          method: 'GET',
          path: '/users/myAccount',
          headers: {},
        })
        .then((result) => {
          expect(result.statusCode).toBe(401);

          const { message } = JSON.parse(result.body) as ResponseBodyError;
          expect(message).toEqual(
            'Token do usuário não informado ou incorreto',
          );
        });
    });

    it('should error if authorization token is not valid', async () => {
      return app
        .inject({
          method: 'GET',
          path: '/users/myAccount',
          headers: {
            authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJlbWFpbCI6IkpvaG4gRG9lIn0.VGvJF5IrQBifEYnPl2E5cTKWoVbpfxKuCk7tdpT3v2U`,
          },
        })
        .then((result) => {
          expect(result.statusCode).toBe(401);

          const { message } = JSON.parse(result.body) as ResponseBodyError;
          expect(message).toEqual(
            'Você não tem permissão para acessar está funcionalidade',
          );
        });
    });

    it('should success (200) if authorization token is valid', async () => {
      const { accessToken } = createAndAuthenticateUser();

      return app
        .inject({
          method: 'GET',
          path: '/users/myAccount',
          headers: { authorization: `Bearer ${accessToken}` },
        })
        .then((result) => {
          expect(result.statusCode).toBe(200);

          // const { message } = JSON.parse(result.body) as ResponseBodyError;
          // expect(message).toEqual(
          //   'Você não tem permissão para acessar está funcionalidade, token de acesso invalido',
          // );
        });
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });
});
