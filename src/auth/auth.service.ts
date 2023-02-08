import { Injectable } from '@nestjs/common';
import { Either, left } from 'src/core/logic/Either';
import { Document } from 'src/users/domain/entity/users/document';
import { Password } from 'src/users/domain/entity/users/password';
import { UserRepository } from 'src/users/infra/repositories/user.repository';
import { UserAccountNotExistsError } from './errors/user-account-not-exists.error';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UserRepository) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Either<Error, any>> {
    const documentOrError = Document.create(username);
    const passwordOrError = Password.create(password);

    if (documentOrError.isLeft()) {
      return left(documentOrError.value);
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const document = documentOrError.value;

    const user = await this.usersRepository.getByDocument(document.value);

    if (!user) {
      return left(new UserAccountNotExistsError());
    }

    
  }
}
