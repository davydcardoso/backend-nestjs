import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CompaniesController } from './infra/controllers/companies.controller';
import { CompanyRepository } from './infra/repositories/company.repository';
import { CompanyRepositoryPrisma } from './infra/repositories/company.repository.prisma';
import { CreateCompanyUseCase } from './use-cases/create-company-usecase';

@Module({
  controllers: [CompaniesController],
  imports: [PrismaModule],
  providers: [
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
    CreateCompanyUseCase,
  ],
})
export class CompaniesModule {}
