import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { UserRepositoryPrisma } from 'src/users/infra/repositories/user.repository.prisma';

@Module({
  controllers: [],
  imports: [PrismaModule],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryPrisma,
    },
    AuthService,
  ],
})
export class AuthModule {}
