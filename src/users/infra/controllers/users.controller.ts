import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Headers,
  Get,
  Put,
} from '@nestjs/common';
import {
  CreateUserRequestProps,
  CreateUserRrequestHeaderProps,
  GetUserAccountRequestHeaders,
  UpdateAccountRequestBody,
  UpdateAccountRequestHeader,
} from 'src/users/dtos/user-controller.dto';
import { CreateUserUseCase } from 'src/users/use-cases/create-user-usecase';
import { GetUserAccountUseCase } from 'src/users/use-cases/get-user-account-usecase';

import { UnauthorizedException } from '@nestjs/common/exceptions';
import { CompanyNotExistsError } from 'src/users/use-cases/errors/company-not-exists.error';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserAccountUseCase: GetUserAccountUseCase,
  ) {}

  @Post()
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

    return result.value;
  }

  @Get('myAccount')
  async getAccount(
    @Headers() headers: GetUserAccountRequestHeaders,
  ): Promise<any> {
    const { userId } = headers;

    const result = await this.getUserAccountUseCase.perform({ userId });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }

    return result.value;
  }

  @Put()
  async update(
    @Headers() headers: UpdateAccountRequestHeader,
    @Body() body: UpdateAccountRequestBody,
  ): Promise<any> {
    
  }
}
