import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidCompanyEmailError extends Error implements DomainError {
  constructor() {
    super('O e-mail informado é invalido');
    this.name = 'InvalidCompanyEmailError';
  }
}
