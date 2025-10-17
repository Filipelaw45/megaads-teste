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
  for (let i = 1; i <= 10; i++) {
    const client = new Client();
    client.firstName = `ClientFirstName${i}`;
    client.lastName = `ClientLastName${i}`;
    client.email = `client${i}@example.com`;
    client.cpfCnpj = `1234567890${i}`;
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
