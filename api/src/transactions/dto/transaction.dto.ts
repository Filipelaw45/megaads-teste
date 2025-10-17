import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  TransactionKind,
  TransactionStatus,
} from '../entities/transaction.entity';
import { ClientDto } from '../../clients/dto/client.dto';
import { AggregateRootDto } from 'src/shared/aggregate-root.dto';
import { IsEnum } from 'class-validator';

export class TransactionDto extends AggregateRootDto {
  @ApiProperty({
    description: 'Tipo da transação',
    enum: ['PAYABLE', 'RECEIVABLE'],
    example: 'PAYABLE',
  })
  @Expose()
  kind: TransactionKind;

  @ApiProperty({
    description: 'Descrição da transação',
    example: 'Pagamento do serviço de consultoria',
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Valor da transação',
    example: 1500.0,
  })
  @Expose()
  amount: number;

  @ApiProperty({
    description: 'Status da transação',
    enum: ['PENDING', 'PAID', 'CANCELLED'],
    example: 'PENDING',
  })
  @Expose()
  @IsEnum(['PENDING', 'PAID', 'CANCELLED'], {
    message: 'O status deve ser PENDING, PAID ou CANCELLED',
  })
  status: string;

  @ApiProperty({
    description: 'Data de vencimento',
    example: '2025-10-30T00:00:00Z',
  })
  @Expose()
  dueDate: Date;

  @ApiProperty({
    description: 'Data de pagamento',
    example: '2025-10-16T10:00:00Z ou null se não pago',
    required: false,
  })
  @Expose()
  paymentDate?: Date;

  @ApiProperty({
    description: 'ID do cliente',
    example: '67526397952',
    required: false,
  })
  @Expose()
  clientId?: string;

  @ApiProperty({
    description: 'Dados do cliente relacionado',
    type: ClientDto,
    required: false,
  })
  @Expose()
  @Type(() => ClientDto)
  client?: ClientDto;
}
