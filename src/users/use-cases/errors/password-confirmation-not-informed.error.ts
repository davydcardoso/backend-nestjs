import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class PasswordConfirmationNotInformedError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('A confirmação de senha não foi informada');
    this.name = 'PasswordConfirmationNotInformedError';
  }
}
