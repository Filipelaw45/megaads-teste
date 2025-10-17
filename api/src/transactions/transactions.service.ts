import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { plainToInstance } from 'class-transformer';
import { getBrasiliaTime } from 'src/utils/date-utils';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    if (createTransactionDto.clientId) {
      const clientExists = await this.clientRepository.findOne({
        where: { id: createTransactionDto.clientId },
      });

      if (!clientExists) {
        throw new NotFoundException(
          `Cliente com ID ${createTransactionDto.clientId} não encontrado`,
        );
      }
    }

    const transaction = this.transactionRepository.create(createTransactionDto);
    const savedTransaction = await this.transactionRepository.save(transaction);

    const transactionWithClient = await this.transactionRepository.findOne({
      where: { id: savedTransaction.id },
      relations: ['client'],
    });

    return plainToInstance(TransactionDto, transactionWithClient, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(queryDto: QueryTransactionDto): Promise<{
    data: TransactionDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      kind,
      status,
      clientId,
      from,
      to,
      page = 1,
      limit = 100,
    } = queryDto;

    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.client', 'client');

    if (kind) {
      queryBuilder.andWhere('transaction.kind = :kind', { kind });
    }

    if (status) {
      queryBuilder.andWhere('transaction.status = :status', { status });
    }

    if (clientId) {
      queryBuilder.andWhere('transaction.clientId = :clientId', { clientId });
    }

    if (from && to) {
      queryBuilder.andWhere('transaction.dueDate BETWEEN :from AND :to', {
        from,
        to,
      });
    } else if (from) {
      queryBuilder.andWhere('transaction.dueDate >= :from', { from });
    } else if (to) {
      queryBuilder.andWhere('transaction.dueDate <= :to', { to });
    }

    const [transactions, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('transaction.dueDate', 'DESC')
      .getManyAndCount();

    return {
      data: plainToInstance(TransactionDto, transactions, {
        excludeExtraneousValues: true,
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }

    return plainToInstance(TransactionDto, transaction, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }

    if (updateTransactionDto.clientId) {
      const clientExists = await this.clientRepository.findOne({
        where: { id: updateTransactionDto.clientId },
      });

      if (!clientExists) {
        throw new NotFoundException(
          `Cliente com ID ${updateTransactionDto.clientId} não encontrado`,
        );
      }
    }

    Object.assign(transaction, updateTransactionDto);

    const updatedTransaction =
      await this.transactionRepository.save(transaction);

    return plainToInstance(TransactionDto, updatedTransaction, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }

    await this.transactionRepository.softDelete(id);

    return;
  }

  async pay(id: string): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada`);
    }

    if (transaction.status === TransactionStatus.PAID) {
      throw new BadRequestException('Transação já está paga');
    }

    if (transaction.status === TransactionStatus.CANCELLED) {
      throw new BadRequestException('Transação cancelada não pode ser paga');
    }

    transaction.status = TransactionStatus.PAID;
    transaction.paymentDate = getBrasiliaTime();

    const paidTransaction = await this.transactionRepository.save(transaction);

    return plainToInstance(TransactionDto, paidTransaction, {
      excludeExtraneousValues: true,
    });
  }
}
