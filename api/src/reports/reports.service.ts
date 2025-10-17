import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Transaction,
  TransactionKind,
  TransactionStatus,
} from '../transactions/entities/transaction.entity';
import { CashflowQueryDto } from './dto/cashflow-query.dto';
import {
  CashflowResponseDto,
  CashflowTimelineItemDto,
} from './dto/cashflow-response.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getCashflow(queryDto: CashflowQueryDto): Promise<CashflowResponseDto> {
    const { from, to } = queryDto;

    const transactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.status = :status', { status: TransactionStatus.PAID })
      .andWhere('transaction.paymentDate BETWEEN :from AND :to', { from, to })
      .orderBy('transaction.paymentDate', 'ASC')
      .getMany();

    const received = transactions
      .filter((t) => t.kind === TransactionKind.RECEIVABLE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const paid = transactions
      .filter((t) => t.kind === TransactionKind.PAYABLE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = received - paid;

    const timelineMap = new Map<string, { in: number; out: number }>();

    transactions.forEach((transaction) => {
      if (!transaction.paymentDate) {
        return;
      }

      const dateObj = new Date(transaction.paymentDate);
      const date = dateObj.toISOString().split('T')[0];

      if (!timelineMap.has(date)) {
        timelineMap.set(date, { in: 0, out: 0 });
      }

      const entry = timelineMap.get(date)!;

      if (transaction.kind === TransactionKind.RECEIVABLE) {
        entry.in += Number(transaction.amount);
      } else {
        entry.out += Number(transaction.amount);
      }
    });

    const timeline: CashflowTimelineItemDto[] = Array.from(timelineMap.entries())
      .map(([date, values]) => ({
        date,
        in: Number(values.in.toFixed(2)),
        out: Number(values.out.toFixed(2)),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      period: {
        from,
        to,
      },
      totals: {
        received: Number(received.toFixed(2)),
        paid: Number(paid.toFixed(2)),
        balance: Number(balance.toFixed(2)),
      },
      timeline,
    };
  }
}
