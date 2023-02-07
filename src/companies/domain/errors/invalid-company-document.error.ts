import { DomainError } from 'src/core/domain/errors/DomainError';

export class InvalidCompanyDocumentError extends Error implements DomainError {
  constructor() {
    super('O documento informado é invalido');
    this.name = 'InvalidCompanyDocumentError';
  }
}
