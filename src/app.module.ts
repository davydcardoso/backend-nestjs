import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';

import { AuthMiddleware } from './auth.middleware';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { CompaniesModule } from './companies/companies.module';

import { UserRepository } from './users/infra/repositories/user.repository';
import { CompanyRepository } from './companies/infra/repositories/company.repository';
import { UserRepositoryPrisma } from './users/infra/repositories/user.repository.prisma';
import { CompanyRepositoryPrisma } from './companies/infra/repositories/company.repository.prisma';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, CompaniesModule],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: UserRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'users/myAccount', method: RequestMethod.GET });
  }
}
