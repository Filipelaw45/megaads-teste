import { Client } from "../models/client.model";

export enum TransactionKind {
  PAYABLE = 'PAYABLE',
  RECEIVABLE = 'RECEIVABLE'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  paymentDate?: Date;
  kind: TransactionKind;
  status: TransactionStatus;
  clientId: string;
  client: Client;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
