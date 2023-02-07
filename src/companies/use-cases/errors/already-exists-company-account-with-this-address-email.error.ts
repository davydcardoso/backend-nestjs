import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class AlreadyExistsCompanyAccountWithThisAddressEmailError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Já existe uma empresa registrada com o email informado');
    this.name = 'AlreadyExistsCompanyAccountWithThisAddressEmailError';
  }
}
