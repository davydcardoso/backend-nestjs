import { Module } from '@nestjs/common';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';
import { CompanyRepositoryPrisma } from 'src/companies/infra/repositories/company.repository.prisma';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './infra/controllers/users.controller';
import { UserRepository } from './infra/repositories/user.repository';
import { UserRepositoryPrisma } from './infra/repositories/user.repository.prisma';
import { CreateUserUseCase } from './use-cases/create-user-usecase';

@Module({
  controllers: [UsersController],
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
  ],
  imports: [PrismaModule],
})
export class UsersModule {}
