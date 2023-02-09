import { hashSync } from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { COMPANY_ADMIN_ID, UserAdmSEED, USER_ADMIN_ID_1, USER_ADMIN_ID_2 } from './seed.constants';

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('SEED: Criando usuário e empresa da administração do sistema');

    await prisma.companies.upsert({
      create: {
        id: COMPANY_ADMIN_ID,
        name: 'Prodata Informatica',
        email: 'dev@prodata.com',
        document: '00.000.000/0001-11',
        createdAt: new Date(),
        Users: {
          connectOrCreate: [
            {
              create: { ...UserAdmSEED, accessLevel: 'DEVELOPER' },
              where: { id: USER_ADMIN_ID_1 },
            },
            {
              create: {
                id: USER_ADMIN_ID_2,
                name: 'Prodata Administrador 2',
                email: 'developper@prodata.com',
                password: hashSync('Dv@_824657', 8),
                document: '00.000.000/0001-12',
                accessLevel: 'DEVELOPER',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              where: { id: USER_ADMIN_ID_2 },
            },
          ],
        },
      },
      update: {
        updatedAt: new Date(),
      },
      where: { id: COMPANY_ADMIN_ID },
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
