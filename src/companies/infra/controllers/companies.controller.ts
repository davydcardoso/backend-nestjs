import { Res, Body, Controller, HttpException, Post } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { ApiAcceptedResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateCompanyRequestProps } from 'src/companies/dtos/create-companies.dto';
import { CreateCompanyUseCase } from 'src/companies/use-cases/create-company-usecase';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly createCompaniesUseCase: CreateCompanyUseCase) {}

  @Post()
  @ApiAcceptedResponse()
  async create(
    @Res() response: Response,
    @Body() body: CreateCompanyRequestProps,
  ) {
    const { name, email, document } = body;

    const result = await this.createCompaniesUseCase.perform({
      name,
      email,
      document,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    response
      .status(HttpStatus.CREATED)
      .send({ message: 'Empresa cadastrada com sucesso' });
    return;
  }
}
