import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class CompanyNotExistsError extends Error implements UseCaseError {
  constructor() {
    super('A empresa informada não existe no sistema');
    this.name = 'CompanyNotExistsError';
  }
}
