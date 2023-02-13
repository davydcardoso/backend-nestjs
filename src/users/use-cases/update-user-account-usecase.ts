import { UseCase } from 'src/core/domain/use-case';
import { Either, left } from 'src/core/logic/Either';
import { Document } from '../domain/entity/users/document';
import { Email } from '../domain/entity/users/email';
import { Name } from '../domain/entity/users/name';
import { Password } from '../domain/entity/users/password';
import { User } from '../domain/entity/users/user.entity';
import { UserRepository } from '../infra/repositories/user.repository';
import { OldPasswordEnteredIsNotCorrectError } from './errors/old-password-entered-is-not-correct.error';
import { PasswordsDoNotMatchError } from './errors/password-do-not-match.error';
import { PasswordInformedNotCorrectError } from './errors/password-informed-not-correct.error';
import { UserAccountIsNotExistsError } from './errors/user-account-is-not-exists.error';
import { UserIdNotDefinedError } from './errors/userid-is-not-defined.error';

type UpdateAccountUseCaseRequest = {
  userId: string;
  name: string;
  email: string;
  document: string;
  password: string;
  newPassword?: string;
  confirmPassword?: string;
};

type UpdateAccountUseCaseResponse = Either<
  Error,
  UpdateAccountUseCaseResponseProps
>;

type UpdateAccountUseCaseResponseProps = {};

export class UpdateAccountUseCase implements UseCase {
  constructor(private readonly usersRepository: UserRepository) {}

  async perform({
    userId,
    name,
    email,
    document,
    password,
    newPassword,
    confirmPassword,
  }: UpdateAccountUseCaseRequest): Promise<UpdateAccountUseCaseResponse> {
    if (!userId || userId.trim().length < 5 || userId.trim().length > 255) {
      return left(new UserIdNotDefinedError());
    }

    const nameOrError = Name.create(name);
    const emailOrError = Email.create(email);
    const documentOrError = Document.create(document);
    const passwordOrError = Password.create(password);

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (documentOrError.isLeft()) {
      return left(documentOrError.value);
    }

    const user = await this.usersRepository.getById(userId);

    if (!user) {
      return left(new UserAccountIsNotExistsError());
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    type AlterPasswordProps = {
      password: string;
      correction: string;
    };

    let alterPassword: AlterPasswordProps;

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        return left(new PasswordsDoNotMatchError());
      }

      if (!user.password.comparePassword(password)) {
        return left(new OldPasswordEnteredIsNotCorrectError());
      }

      const _newPasswordOrError = Password.create(newPassword);

      if (_newPasswordOrError.isLeft()) {
        return left(new OldPasswordEnteredIsNotCorrectError());
      }

      const _updatedUserDataOrError = User.create(
        {
          name: nameOrError.value,
          email: emailOrError.value,
          document: documentOrError.value,
          accessLevel: user.accessLevel,
          companyId: user.companyId,
          password: _newPasswordOrError.value,
          updatedAt: new Date(),
        },
        user.id,
      );

      if (_updatedUserDataOrError.isLeft()) {
        return left(_updatedUserDataOrError.value);
      }

      await this.usersRepository.update(user.id, _updatedUserDataOrError.value);

      return;
    }
  }
}
