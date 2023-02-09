import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { UsersController } from './infra/controllers/users.controller';

import { CreateUserUseCase } from './use-cases/create-user-usecase';
import { GetUserAccountUseCase } from './use-cases/get-user-account-usecase';

import { UserRepository } from './infra/repositories/user.repository';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';

import { UserRepositoryPrisma } from './infra/repositories/user.repository.prisma';
import { CompanyRepositoryPrisma } from 'src/companies/infra/repositories/company.repository.prisma';

@Module({
  controllers: [UsersController],
  imports: [PrismaModule],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
    CreateUserUseCase,
    GetUserAccountUseCase,
  ],
})
export class UsersModule {}
