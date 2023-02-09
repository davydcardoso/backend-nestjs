import { verify, decode, JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { UserRepository } from './users/infra/repositories/user.repository';
import { CompanyRepository } from './companies/infra/repositories/company.repository';

interface JwtPayloadExtends extends JwtPayload {
  userId: string;
  companyId: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly companiesRepository: CompanyRepository,
  ) {}

  async use(req: Request, res: Response, next: (error?: any) => void) {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedException(
        'Token do usuário não informado ou incorreto',
      );
    }

    const [, token] = authorization.split(' ');

    if (!token) {
      throw new UnauthorizedException(
        'Token de usuário invalido ou não informado',
      );
    }

    const result = await new Promise<string | JwtPayload>((resolve, reject) => {
      verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          resolve('ERROR');
          return;
        }

        resolve(decoded);
      });
    });

    if (result === 'ERROR') {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar está funcionalidade',
      );
    }

    const { userId, companyId } = result as JwtPayloadExtends;

    if (!userId && !companyId) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar está funcionalidade, token de acesso invalido, empresa e usuário não definidos',
      );
    }

    const user = await this.usersRepository.getById(userId);

    if (!user) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar está funcionalidade, usuário não existe no sistema',
      );
    }

    const company = await this.companiesRepository.getById(companyId);

    if (!company) {
      throw new Error(
        'Você não tem permissão para acessar está funcionalidade, empresa não registrada no sistema ',
      );
    }

    if (!company.status) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar está funcionalidade, o cadatro da empresa está desativado',
      );
    }

    req.headers = { userId, companyId };
    next();
  }
}
