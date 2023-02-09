import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class CompanyAccountNotActivedError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Empresa não está ativada no sistema');
    this.name = 'CompanyAccountNotActivedError';
  }
}
