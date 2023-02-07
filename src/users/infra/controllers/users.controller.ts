import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Res,
  Post,
  Headers,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiCreatedResponse } from '@nestjs/swagger/dist';
import { Response } from 'express';
import {
  CreateUserRequestProps,
  CreateUserRrequestHeaderProps,
} from 'src/users/dtos/create-user.dto';
import { CreateUserUseCase } from 'src/users/use-cases/create-user-usecase';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  // @ApiCreatedResponse({ description: 'Usuário criado com sucesso' })
  async create(
    @Body() body: CreateUserRequestProps,
    @Headers() headers: CreateUserRrequestHeaderProps,
  ) {
    const { name, email, password, document, accessLevel } = body;

    const result = await this.createUserUseCase.perform({
      name,
      email,
      password,
      document,
      accessLevel,
      companyId: '',
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        default:
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
