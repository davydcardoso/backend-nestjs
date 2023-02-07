let clientes = [ 
    { nome: 'Kelvin Silva Sena', cpf: '10286741474', email: 'user@email.com.br', senha: 'passw:Abcd1234' },
    { nome: 'Amyson Jhonata Da Silva', cpf: '10287054411', email: 'user@email.com.br', senha: 'passw:Abcd1234' },
    { nome: 'Matheus Correa Da Silva', cpf: '10287259498', email: 'user@email.com.br', senha: 'passw:Abcd1234' },
    { nome: 'Janekely Batista Dos Santos', cpf: '10288003470', email: 'user@email.com.br', senha: 'passw:Abcd1234' },
    { nome: 'Luan Marcondes Alves De Souza', cpf: '10288469402', email: 'user@email.com.br', senha: 'passw:Abcd1234' },
    { nome: 'Neidi Lucia Ignacio', cpf: '35331701949 ', email: 'user@email.com.br', senha: 'passw:Abcd1234' },
    { nome: 'Neidi Lucia Ignacio ', cpf: '35331701949', email: 'user@email.com.br', senha: 'passw:Abcd1234' },
    { nome: 'Neidi Lucia Ignacio', cpf: '35331701949', email: 'user@email.com.br', senha: 'passw:Abcd1234' },
]

/**
 * Função para geração de emails aleatorios
 * @param max -- Numero maximo de e-mais a criar
 * @returns String[]
 */
export function generateRandomEmail() {
  const emails: string[] = []
  
  let dominios= ['@gmail.com', '@outlook.com', '@bol.com.br']
  for(var i=0;i<clientes.length;i++){
    let label   = clientes[i].nome.split(' ');
    let email   = label[0]+clientes[i].cpf+dominios[Math.floor(Math.random() * dominios.length)];
    emails.push(email)
  }

  return emails
}
