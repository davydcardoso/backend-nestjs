import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [PrismaModule, UsersModule, CompaniesModule, AuthModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
