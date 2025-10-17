import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { User } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';
import {
  Transaction,
  TransactionKind,
  TransactionStatus,
} from '../../transactions/entities/transaction.entity';
import { DataSource } from 'typeorm';
import { formatCpfCnpj } from 'src/utils/CpfCnpj-utils';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const userRepository = dataSource.getRepository(User);
  let adminUser = await userRepository.findOne({
    where: { email: 'admin@example.com' },
  });

  if (!adminUser) {
    adminUser = new User();
    adminUser.email = 'admin@example.com';
    adminUser.username = 'admin';
    adminUser.roles = 'ADMIN';
    adminUser.password = 'Admin@123';
    await userRepository.save(adminUser);
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }

  const clientRepository = dataSource.getRepository(Client);
  const transactionRepository = dataSource.getRepository(Transaction);

  const allTransactions = await transactionRepository.find();
  if (allTransactions.length > 0) {
    await transactionRepository.remove(allTransactions);
    console.log('Cleared existing transactions');
  }

  const allClients = await clientRepository.find();
  if (allClients.length > 0) {
    await clientRepository.remove(allClients);
    console.log('Cleared existing clients');
  }

  const clients: Client[] = [];

  const clientData = [
    {
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao.silva@example.com',
      cpfCnpj: '12345678901',
    },
    {
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'maria.santos@example.com',
      cpfCnpj: '97060938000139',
    },
    {
      firstName: 'Pedro',
      lastName: 'Oliveira',
      email: 'pedro.oliveira@example.com',
      cpfCnpj: '34567890123',
    },
    {
      firstName: 'Ana',
      lastName: 'Costa',
      email: 'ana.costa@example.com',
      cpfCnpj: '45678901234',
    },
    {
      firstName: 'Carlos',
      lastName: 'Ferreira',
      email: 'carlos.ferreira@example.com',
      cpfCnpj: '97437684000125',
    },
    {
      firstName: 'Juliana',
      lastName: 'Almeida',
      email: 'juliana.almeida@example.com',
      cpfCnpj: '67890123456',
    },
    {
      firstName: 'Ricardo',
      lastName: 'Pereira',
      email: 'ricardo.pereira@example.com',
      cpfCnpj: '47535309000140',
    },
    {
      firstName: 'Fernanda',
      lastName: 'Rodrigues',
      email: 'fernanda.rodrigues@example.com',
      cpfCnpj: '89012345678',
    },
    {
      firstName: 'Bruno',
      lastName: 'Martins',
      email: 'bruno.martins@example.com',
      cpfCnpj: '90123456789',
    },
    {
      firstName: 'Patricia',
      lastName: 'Lima',
      email: 'patricia.lima@example.com',
      cpfCnpj: '35715039000170',
    },
    {
      firstName: 'Lucas',
      lastName: 'Souza',
      email: 'lucas.souza@example.com',
      cpfCnpj: '11223344556',
    },
    {
      firstName: 'Camila',
      lastName: 'Barbosa',
      email: 'camila.barbosa@example.com',
      cpfCnpj: '22334455667',
    },
    {
      firstName: 'Rafael',
      lastName: 'Cardoso',
      email: 'rafael.cardoso@example.com',
      cpfCnpj: '33445566778',
    },
    {
      firstName: 'Beatriz',
      lastName: 'Gomes',
      email: 'beatriz.gomes@example.com',
      cpfCnpj: '44556677889',
    },
    {
      firstName: 'Felipe',
      lastName: 'Nascimento',
      email: 'felipe.nascimento@example.com',
      cpfCnpj: '55667788990',
    },
    {
      firstName: 'Larissa',
      lastName: 'Araújo',
      email: 'larissa.araujo@example.com',
      cpfCnpj: '66778899001',
    },
    {
      firstName: 'Thiago',
      lastName: 'Ribeiro',
      email: 'thiago.ribeiro@example.com',
      cpfCnpj: '77889900112',
    },
    {
      firstName: 'Amanda',
      lastName: 'Carvalho',
      email: 'amanda.carvalho@example.com',
      cpfCnpj: '88990011223',
    },
    {
      firstName: 'Gabriel',
      lastName: 'Dias',
      email: 'gabriel.dias@example.com',
      cpfCnpj: '99001122334',
    },
    {
      firstName: 'Vanessa',
      lastName: 'Moreira',
      email: 'vanessa.moreira@example.com',
      cpfCnpj: '10111213141',
    },
  ];

  for (const data of clientData) {
    const client = new Client();
    client.firstName = data.firstName;
    client.lastName = data.lastName;
    client.email = data.email;
    client.cpfCnpj = formatCpfCnpj(data.cpfCnpj);
    clients.push(client);
  }
  await clientRepository.save(clients);
  console.log(`Created ${clients.length} clients`);

  const transactions: Transaction[] = [];
  const clientIds = clients.map((client) => client.id);
  for (let i = 0; i < 30; i++) {
    const transaction = new Transaction();
    transaction.kind =
      Math.random() > 0.5
        ? TransactionKind.PAYABLE
        : TransactionKind.RECEIVABLE;
    transaction.status = TransactionStatus.PENDING;
    transaction.amount = parseFloat((Math.random() * 100).toFixed(2));
    transaction.description = `Transaction ${i + 1}`;
    transaction.dueDate = new Date(
      Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000,
    );
    transaction.clientId =
      clientIds[Math.floor(Math.random() * clientIds.length)];
    transactions.push(transaction);
  }
  await transactionRepository.save(transactions);
  console.log(`Created ${transactions.length} transactions`);

  await app.close();
}

seed()
  .then(() => {
    console.log('Seeding completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
