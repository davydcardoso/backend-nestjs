import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';

import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { UserRepositoryInMemory } from 'src/users/infra/repositories/user.repository.in-memory';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useClass: UserRepositoryInMemory,
        },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
