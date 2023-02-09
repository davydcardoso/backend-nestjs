import { Injectable } from '@nestjs/common';
import { UseCase } from 'src/core/domain/use-case';
import { Either, left, right } from 'src/core/logic/Either';
import { UserRepository } from '../infra/repositories/user.repository';
import { UserAccountIsNotExistsError } from './errors/user-account-is-not-exists.error';
import { UserIdNotDefinedError } from './errors/userid-is-not-defined.error';

type GetUserAccountUseCaseRequest = {
  userId: string;
};

type GetUserAccountUseCaseResponse = Either<
  Error,
  GetUserAccountUseCaseResponseProps
>;

type GetUserAccountUseCaseResponseProps = {
  id: string;
  name: string;
  email: string;
  document: string;
  accessLevel: string;
};

@Injectable()
export class GetUserAccountUseCase implements UseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async perform({
    userId,
  }: GetUserAccountUseCaseRequest): Promise<GetUserAccountUseCaseResponse> {
    if (!userId || userId.trim().length < 5 || userId.trim().length > 255) {
      return left(new UserIdNotDefinedError());
    }

    const user = await this.userRepository.getById(userId);

    if (!user) {
      return left(new UserAccountIsNotExistsError());
    }

    return right({
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      document: user.document.value,
      accessLevel: user.accessLevel.value,
    });
  }
}
