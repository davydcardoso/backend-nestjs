import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class CompanyIdNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('O id da empresa não foi informado no aplicativo');
    this.name = 'CompanyIdNotFoundError';
  }
}
