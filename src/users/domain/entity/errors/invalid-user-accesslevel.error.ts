import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidUserAccessLevelError extends Error implements DomainError {
  constructor() {
    super('O nivel de acesso informado é invalido');
    this.name = 'InvalidUserAccessLevelError';
  }
}
