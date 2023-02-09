import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { UserRepositoryPrisma } from 'src/users/infra/repositories/user.repository.prisma';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { CompanyRepository } from 'src/companies/infra/repositories/company.repository';
import { CompanyRepositoryPrisma } from 'src/companies/infra/repositories/company.repository.prisma';

@Module({
  controllers: [AuthController],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  exports: [AuthService],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryPrisma,
    },
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryPrisma,
    },
    AuthService,
  ],
})
export class AuthModule {}
