import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class UserIdNotDefinedError extends Error implements UseCaseError {
  constructor() {
    super('Id do usuário não definido na requisição');
    this.name = 'UserIdNotDefinedError';
  }
}
