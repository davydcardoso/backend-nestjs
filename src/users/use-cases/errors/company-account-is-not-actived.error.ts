import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class CompanyAccountIsNotActivedError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('A empresa deste aplicativo não está com a conta ativada!');
    this.name = 'CompanyAccountIsNotActivedError';
  }
}
