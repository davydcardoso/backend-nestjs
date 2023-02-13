import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class OldPasswordEnteredIsNotCorrectError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('A senha informada não coincide com a senha anterior do usuario');
    this.name = 'OldPasswordEnteredIsNotCorrectError';
  }
}
