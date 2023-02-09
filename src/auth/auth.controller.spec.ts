import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from 'src/app.module';
import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { USER_ADMIN_DOCUMENT_1 } from '../prisma/seed.constants';

describe('AuthController (e2e)', () => {
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

  type BodyErrorResponseProps = {
    message: string;
  };

  type BodySuccessResponseProps = {
    user: {
      name: string;
      email: string;
      document: string;
      companyId: string;
      accessLevel: string;
    };
    accessToken: string;
  };

  describe('/POST SignIn', () => {
    it('should error if request headers is invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/auth/login',
          headers: {},
        })
        .then((result) => {
          const { message } = JSON.parse(result.body) as BodyErrorResponseProps;
          expect(result.statusCode).toBe(400);
          expect(message).toEqual('Token não informado na requisição');
        });
    });

    it('should error if request header basic token is invalid', async () => {
      return app
        .inject({
          method: 'POST',
          path: '/auth/login',
          headers: {
            authorization: 'Basic cHJvZGF0YXRlc3RAbWFpbDo=',
          },
        })
        .then((result) => {
          const { message } = JSON.parse(result.body) as BodyErrorResponseProps;
          expect(result.statusCode).toBe(401);
          expect(message).toEqual('Dados de acesso do usuário está invalido');
        });
    });

    it('should error if request username is invalid', async () => {
      const token = Buffer.from('000,222,-11:Dv@_8246', 'ascii').toString(
        'base64',
      );

      return app
        .inject({
          method: 'POST',
          path: '/auth/login',
          headers: { authorization: `Basic ${token}` },
        })
        .then((result) => {
          expect(result.statusCode).toBe(401);

          const { message } = JSON.parse(result.body) as BodyErrorResponseProps;
          expect(message).toEqual('Dados de acesso do usuário está invalido');
        });
    });

    it('should error if request password is invalid', async () => {
      const token = Buffer.from('00.000.000/0001-11:123', 'ascii').toString(
        'base64',
      );

      return app
        .inject({
          method: 'POST',
          path: '/auth/login',
          headers: { authorization: `Basic ${token}` },
        })
        .then((result) => {
          expect(result.statusCode).toBe(400);

          const { message } = JSON.parse(result.body) as BodyErrorResponseProps;
          expect(message).toEqual('A senha informada é invalida');
        });
    });
  });

  it('should error if request password is not correct', async () => {
    const token = Buffer.from(
      `${USER_ADMIN_DOCUMENT_1}:Dv@_82465`,
      'ascii',
    ).toString('base64');

    return app
      .inject({
        method: 'POST',
        path: '/auth/login',
        headers: { authorization: `Basic ${token}` },
      })
      .then((result) => {
        expect(result.statusCode).toBe(401);

        const { message } = JSON.parse(result.body) as BodyErrorResponseProps;
        expect(message).toEqual('A senha informada não está correta');
      });
  });

  it('should success login account', async () => {
    const token = Buffer.from(
      `${USER_ADMIN_DOCUMENT_1}:Dv@_824657`,
      'ascii',
    ).toString('base64');

    return app
      .inject({
        method: 'POST',
        path: '/auth/login',
        headers: { authorization: `Basic ${token}` },
      })
      .then((result) => {
        expect(result.statusCode).toBe(200);

        const { accessToken, user } = JSON.parse(
          result.body,
        ) as BodySuccessResponseProps;

        expect(accessToken).toBeTruthy();

        expect(user).toBeTruthy();
        expect(user.name).toBeTruthy();
        expect(user.email).toBeTruthy();
        expect(user.document).toBeTruthy();
        expect(user.companyId).toBeTruthy();
        expect(user.accessLevel).toBeTruthy();
      });
  });
});
