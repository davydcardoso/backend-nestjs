import { randomUUID } from 'crypto';
import { PrismaModule } from 'src/prisma/prisma.module';
import { Test, TestingModule } from '@nestjs/testing';

import { UserAdmSEED } from 'src/prisma/seed.constants';

import { GetUserAccountUseCase } from './get-user-account-usecase';

import { UserRepository } from '../infra/repositories/user.repository';
import { UserRepositoryPrisma } from '../infra/repositories/user.repository.prisma';

import { UserIdNotDefinedError } from './errors/userid-is-not-defined.error';
import { UserAccountIsNotExistsError } from './errors/user-account-is-not-exists.error';

describe('GetUserAccountUseCase', () => {
  let usecase: GetUserAccountUseCase;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetUserAccountUseCase],
      imports: [PrismaModule],
      providers: [
        {
          provide: UserRepository,
          useClass: UserRepositoryPrisma,
        },
      ],
    }).compile();

    usecase = module.get<GetUserAccountUseCase>(GetUserAccountUseCase);
  });

  it('check components has bem defined', () => {
    expect(usecase).toBeDefined();
  });

  it('should error if GetUserAccountUseCase request param user id not informed and isLeft == true', async () => {
    const result = await usecase.perform({} as { userId: string });
    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(new UserIdNotDefinedError());
  });

  it('should error if GetUserAccountUseCase request param user id is invalid and isLeft == true', async () => {
    const result = await usecase.perform({ userId: '' });
    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(new UserIdNotDefinedError());
  });

  it('should error if GetUserAccountUseCase request user is not exsits', async () => {
    const result = await usecase.perform({ userId: randomUUID() });
    expect(result.isLeft()).toBe(true);
    expect(result.value as Error).toEqual(new UserAccountIsNotExistsError());
  });

  it('should success if GetUserAccountUseCase user exists and isRight === true', async () => {
    const user = UserAdmSEED;

    delete user.password;
    delete user.updatedAt;
    delete user.createdAt;

    const result = await usecase.perform({ userId: user.id });
    expect(result.isRight()).toBe(true);
    expect(result.value as Error).toEqual(user);
  });
});
