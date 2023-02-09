import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class CompanyIsNotExistsError extends Error implements UseCaseError {
  constructor() {
    super('Empresa não existe no sistema');
    this.name = 'CompanyIsNotExistsError';
  }
}
