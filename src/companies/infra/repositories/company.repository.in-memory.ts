import { CompanyRepositoryContract } from 'src/companies/contracts/repositories/company.repository.contract';
import { CompanyEntity } from 'src/companies/domain/entity/companies/companies';
import { Repository } from 'src/core/domain/repository';

export class CompanyRepositoryInMemory
  implements Repository<CompanyEntity>, CompanyRepositoryContract
{
  constructor(public items: CompanyEntity[]) {}

  async getByEmail(email: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async getByDocument(document: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async create(data: CompanyEntity): Promise<void> {
    const companyIndex = this.items.findIndex(
      (findCompany) => findCompany.id == data.id,
    );

    this.items[companyIndex] = data;
  }

  async update(id: string, data: CompanyEntity): Promise<void> {
    const companyIndex = this.items.findIndex(
      (findCompany) => findCompany.id == id,
    );

    this.items[companyIndex] = data;
  }

  async patch(
    id: string,
    data: Partial<CompanyEntity>,
  ): Promise<CompanyEntity> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<CompanyEntity> {
    const company = this.items.find((company) => company.id === id);

    return company;
  }

  async getAll(): Promise<CompanyEntity[]> {
    throw new Error('Method not implemented.');
  }

  async getOne(filter: Partial<CompanyEntity>): Promise<CompanyEntity> {
    throw new Error('Method not implemented.');
  }

  async getMany(filter: Partial<CompanyEntity>): Promise<CompanyEntity[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
