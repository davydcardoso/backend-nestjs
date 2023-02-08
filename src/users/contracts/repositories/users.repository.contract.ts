export interface UserRepositoryContract<T = any> {
  getByEmail(email: string): Promise<T>;
  getByDocument(document: string): Promise<T>;
}
