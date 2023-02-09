import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';

import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { UserRepositoryInMemory } from 'src/users/infra/repositories/user.repository.in-memory';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';
import { CompanyRepositoryInMemory } from 'src/companies/infra/repositories/company.repository.in-memory';
import { JwtModule } from '@nestjs/jwt';
import { InvalidUserDocumentError } from 'src/users/domain/entity/errors/invalid-user-document.error';
import { InvalidPasswordUserError } from 'src/users/domain/entity/errors/invalid-password-user.error';
import { UserAccountNotExistsError } from './errors/user-account-not-exists.error';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'secret',
          signOptions: { expiresIn: '1d' },
        }),
      ],
      providers: [
        {
          provide: UserRepository,
          useClass: UserRepositoryInMemory,
        },
        {
          provide: CompanyRepository,
          useClass: CompanyRepositoryInMemory,
        },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should error if AuthService.validateUser request username is invalid and isLeft() == true', async () => {
    const resultTest1 = await service.validateUser('', 'Dv@_8246');
    expect(resultTest1.isLeft()).toBe(true);
    expect(resultTest1.value as Error).toEqual(new InvalidUserDocumentError());

    const resultTest2 = await service.validateUser('prodatainfo', 'Dv@_8246');
    expect(resultTest2.isLeft()).toBe(true);
    expect(resultTest2.value as Error).toEqual(new InvalidUserDocumentError());
  });

  it('should error if AuthService.validateUser request password is invalid and isLeft() == true', async () => {
    const result = await service.validateUser('000.000.000-11', '');
    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(new InvalidPasswordUserError());
  });

  it('should error if AuthService.validateUser request user not exists', async () => {
    const result = await service.validateUser('000.000.000-55', 'Dv@_8246');
    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(new UserAccountNotExistsError());
  });
});
