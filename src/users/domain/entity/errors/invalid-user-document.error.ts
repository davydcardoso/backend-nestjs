import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidUserDocumentError extends Error implements DomainError {
  constructor() {
    super('O CPF/CNPJ do usuário é invalido');
    this.name = 'InvalidUserDocumentError';
  }
}
