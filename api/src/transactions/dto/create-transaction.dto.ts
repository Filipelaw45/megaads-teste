import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { TransactionKind } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Tipo da transação',
    enum: ['PAYABLE', 'RECEIVABLE'],
    example: 'PAYABLE',
  })
  @IsEnum(['PAYABLE', 'RECEIVABLE'], {
    message: 'O tipo deve ser PAYABLE ou RECEIVABLE',
  })
  @IsNotEmpty({ message: 'O tipo não pode estar vazio' })
  kind: TransactionKind;

  @ApiProperty({
    description: 'Descrição da transação',
    example: 'Pagamento do serviço de consultoria',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  description?: string;

  @ApiProperty({
    description: 'Valor da transação',
    example: 1500.0,
    minimum: 0.01,
  })
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @Min(0.01, { message: 'O valor deve ser maior que zero' })
  @IsNotEmpty({ message: 'O valor não pode estar vazio' })
  amount: number;

  @ApiProperty({
    description: 'Data de vencimento (formato: YYYY-MM-DD)',
    example: '2025-10-30',
  })
  @IsDateString(
    {},
    { message: 'A data de vencimento deve ser uma data válida' },
  )
  @IsNotEmpty({ message: 'A data de vencimento não pode estar vazia' })
  dueDate: string;

  @ApiPropertyOptional({
    description: 'ID do cliente relacionado',
    example: '67526397952',
  })
  @IsNotEmpty({ message: 'O ID do cliente não pode estar vazio' })
  @IsString({ message: 'O ID do cliente deve ser uma string' })
  clientId: string;
}
