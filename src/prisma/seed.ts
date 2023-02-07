import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { randomUUID } from 'crypto';

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('SEED: Criando usuário e empresa da administração do sistema');

    await prisma.companies.create({
      data: {
        id: randomUUID(),
        name: 'Prodata Informatica',
        email: 'dev@prodata.com',
        document: '00.000.000/0001-11',
        createdAt: new Date(),
        Users: {
          create: [
            {
              id: randomUUID(),
              name: 'Prodata Administrador',
              email: 'admin@prodata.com',
              password: await hash('Dv@_824657', 8),
              document: '00.000.000/0001-11',
              accessLevel: 'DEVELOPER',
              createdAt: new Date(),
            },
            {
              id: randomUUID(),
              name: 'Prodata Desenvolvedor',
              email: 'developer@prodata.com',
              password: await hash('Dv@_824657', 8),
              document: '00.000.000/0001-11',
              accessLevel: 'DEVELOPER',
              createdAt: new Date(),
            },
          ],
        },
      },
    });

    console.log('SEED: Usuário administrador criado com sucesso!');
  } catch (err) {
    console.log('SEED: Houve um erro ao criar usuário de administração');
    console.log('SEED: Erro: ', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
