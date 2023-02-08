import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class UserAccountNotExistsError extends Error implements UseCaseError {
  constructor() {
    super('Usuário não existe no sistema');
    this.name = 'UserAccountNotExistsError';
  }
}
