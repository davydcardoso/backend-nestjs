import { Injectable } from '@nestjs/common';
import { CompanyRepositoryContract } from 'src/companies/contracts/repositories/company.repository.contract';
import { CompanyEntity } from 'src/companies/domain/entity/companies/companies';
import { CompanyMapper } from 'src/companies/mappers/company.mapper';
import { Repository } from 'src/core/domain/repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyRepositoryPrisma
  implements Repository<CompanyEntity>, CompanyRepositoryContract
{
  private readonly mapper: CompanyMapper;

  constructor(private readonly prisma: PrismaService) {
    this.mapper = new CompanyMapper();
  }

  async create(company: CompanyEntity): Promise<void> {
    const data = await this.mapper.toPersistence(company);

    await this.prisma.companies.create({ data });
  }

  async update(id: string, company: CompanyEntity): Promise<void> {
    const data = await this.mapper.toPersistence(company);

    await this.prisma.companies.update({ data, where: { id } });
  }

  async patch(
    id: string,
    company: Partial<CompanyEntity>,
  ): Promise<CompanyEntity> {
    throw new Error('Method not implemented.');
  }

  async getById(id: string): Promise<CompanyEntity> {
    const company = await this.prisma.companies.findUnique({ where: { id } });

    if (!company) {
      return null;
    }

    return this.mapper.toDomain(company);
  }

  async getByDocument(document: string): Promise<CompanyEntity> {
    const company = await this.prisma.companies.findUnique({
      where: { document },
    });

    if (!company) {
      return null;
    }

    return this.mapper.toDomain(company);
  }

  async getByEmail(email: string): Promise<CompanyEntity> {
    const company = await this.prisma.companies.findUnique({
      where: { email },
    });

    if (!company) {
      return null;
    }

    return this.mapper.toDomain(company);
  }

  async getAll(): Promise<CompanyEntity[]> {
    const companies = await this.prisma.companies.findMany();

    if (!companies || companies.length <= 0) {
      return null;
    }

    return companies.map((company) => this.mapper.toDomain(company));
  }

  async getOne(filter: Partial<CompanyEntity>): Promise<CompanyEntity> {
    throw new Error('Method not implemented.');
  }

  async getMany(filter: Partial<CompanyEntity>): Promise<CompanyEntity[]> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<void> {
    await this.prisma.companies.delete({ where: { id } });
  }
}
