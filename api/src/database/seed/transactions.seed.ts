import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Transaction,
  TransactionKind,
  TransactionStatus,
} from '../../transactions/entities/transaction.entity';
import { Client } from '../../clients/entities/client.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class TransactionsSeed {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async seed() {
    const clients = await this.clientRepository.find();
    const transactions: Transaction[] = [];

    for (let i = 0; i < this.getRandomInt(20, 40); i++) {
      const transaction = new Transaction();
      transaction.kind = this.getRandomTransactionKind();
      transaction.status = this.getRandomTransactionStatus();
      transaction.amount = parseFloat(faker.finance.amount());
      transaction.description = faker.lorem.sentence();
      transaction.dueDate = this.getRandomDate(60);
      transaction.clientId =
        clients[this.getRandomInt(0, clients.length - 1)].id;
      transactions.push(transaction);
    }

    await this.transactionRepository.save(transactions);
  }

  private getRandomTransactionKind(): TransactionKind {
    return Math.random() < 0.5
      ? TransactionKind.PAYABLE
      : TransactionKind.RECEIVABLE;
  }

  private getRandomTransactionStatus(): TransactionStatus {
    const statuses = Object.values(TransactionStatus);
    return statuses[this.getRandomInt(0, statuses.length - 1)];
  }

  private getRandomDate(days: number): Date {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * days);
    return new Date(today.setDate(today.getDate() + randomDays));
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
