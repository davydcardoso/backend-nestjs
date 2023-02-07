import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidCompanyNameError extends Error implements DomainError {
  constructor() {
    super('Nome da empresa informada está invalido');
    this.name = 'InvalidCompanyNameError';
  }
}
