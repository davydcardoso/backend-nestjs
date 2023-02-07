import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class InvalidBodyDataError extends Error implements UseCaseError {
  constructor() {
    super('Erro ao criar empresa, os dados estão vazios');
    this.name = 'InvalidBodyDataError';
  }
}
