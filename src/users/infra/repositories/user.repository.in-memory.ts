import { Injectable } from '@nestjs/common';
import { Repository } from 'src/core/domain/repository';
import { UserRepositoryContract } from 'src/users/contracts/repositories/users.repository.contract';
import { User } from 'src/users/domain/entity/users/user.entity';

@Injectable()
export class UserRepositoryInMemory
  implements Repository<User>, UserRepositoryContract
{
  public users: User[];

  constructor() {
    this.users = [];
  }

  async getByDocument(document: string): Promise<User> {
    return this.users.find((user) => user.document.value === document);
  }

  async create(data: User): Promise<void> {
    this.users.push(data);
  }

  async update(id: string, data: User): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    this.users[userIndex] = data;
  }

  async patch(id: string, data: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }

  async getAll(): Promise<User[]> {
    return this.users;
  }

  async getOne(filter: Partial<User>): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async getMany(filter: Partial<User>): Promise<User[]> {
    return this.users;
  }

  async delete(id: string): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    this.users[userIndex] = null;
  }

  async getByEmail(email: string): Promise<any> {
    return this.users.find((user) => user.email.value === email);
  }
}
