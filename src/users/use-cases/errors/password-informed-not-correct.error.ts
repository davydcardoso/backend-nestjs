import { UseCaseError } from 'src/core/domain/errors/UseCaseError';

export class PasswordInformedNotCorrectError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('A senha informada não está correta!');
    this.name = 'PasswordInformedNotCorrectError';
  }
}
