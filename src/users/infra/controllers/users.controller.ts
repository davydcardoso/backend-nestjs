import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Res,
  Post,
  Headers,
} from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ApiResponse } from '@nestjs/swagger';
import { ApiCreatedResponse } from '@nestjs/swagger/dist';
import { Response } from 'express';
import {
  CreateUserRequestProps,
  CreateUserRrequestHeaderProps,
} from 'src/users/dtos/create-user.dto';
import { CreateUserUseCase } from 'src/users/use-cases/create-user-usecase';
import { CompanyNotExistsError } from 'src/users/use-cases/errors/company-not-exists.error';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  // @ApiCreatedResponse({ description: 'Usuário criado com sucesso' })
  async create(
    @Body() body: CreateUserRequestProps,
    @Headers() headers: CreateUserRrequestHeaderProps,
  ) {
    const { companyid } = headers;
    const { name, email, password, document, accessLevel } = body;

    const result = await this.createUserUseCase.perform({
      name,
      email,
      password,
      document,
      accessLevel,
      companyId: companyid,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case CompanyNotExistsError:
          throw new UnauthorizedException(
            'Você não tem permissão para realizar está ação',
          );
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
