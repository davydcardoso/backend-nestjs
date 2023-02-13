import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class PasswordsDoNotMatchError extends Error implements UseCaseError {
  constructor() {
    super('A senha informada não coincidem');
    this.name = 'PasswordsDoNotMatchError';
  }
}
