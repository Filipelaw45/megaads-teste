import { PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { TransactionStatus } from '../entities/transaction.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @ApiProperty({
    description: 'Status da transação',
    enum: ['PENDING', 'PAID', 'CANCELLED'],
    example: 'PAID',
    required: false,
  })
  @IsOptional()
  @IsEnum(TransactionStatus, {
    message: 'Status deve ser PENDING, PAID ou CANCELLED',
  })
  status?: TransactionStatus;
}
