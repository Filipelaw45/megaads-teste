import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../users/entities/user.entity';
import { Client } from '../clients/entities/client.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

config();

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Client, Transaction],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: !isProduction,
});
