import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class InvalidPasswordValueError extends Error implements UseCaseError {
  constructor() {
    super('A senha informada não está valida');
    this.name = 'InvalidPasswordValueError';
  }
}
