import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class AlreadyExistsCompanyAccountWithThisDocumentError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Já existe uma empresa registrada com o documento informado');
    this.name = 'AlreadyExistsCompanyAccountWithThisDocumentError';
  }
}
