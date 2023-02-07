import { Either, left, right } from 'src/core/logic/Either';
import { InvalidUserDocumentError } from '../errors/invalid-user-document.error';

export class Document {
  private readonly document: string;

  get value() {
    return this.document;
  }

  private constructor(value: string) {
    this.document = value;
  }

  static validate(value: string): boolean {
    if (!value || value.trim().length < 5 || value.trim().length > 19) {
      return false;
    }

    const regex =
      /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;

    if (!regex.test(value)) {
      return false;
    }

    return true;
  }

  static create(value: string): Either<InvalidUserDocumentError, Document> {
    if (!this.validate(value)) {
      return left(new InvalidUserDocumentError());
    }

    return right(new Document(value));
  }
}
