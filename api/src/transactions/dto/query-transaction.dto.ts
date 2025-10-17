import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transaction } from 'typeorm';
import { TransactionKind } from '../entities/transaction.entity';

export class QueryTransactionDto {
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de transação',
    enum: ['PAYABLE', 'RECEIVABLE'],
    example: 'PAYABLE',
  })
  @IsOptional()
  @IsEnum(['PAYABLE', 'RECEIVABLE'], {
    message: 'O tipo deve ser PAYABLE ou RECEIVABLE',
  })
  kind?: TransactionKind;

  @ApiPropertyOptional({
    description: 'Filtrar por status da transação',
    enum: ['PENDING', 'PAID', 'CANCELLED'],
    example: 'PENDING',
  })
  @IsOptional()
  @IsEnum(['PENDING', 'PAID', 'CANCELLED'], {
    message: 'O status deve ser PENDING, PAID ou CANCELLED',
  })
  status?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID do cliente',
    example: '67526397952',
  })
  @IsOptional()
  @IsString({ message: 'O ID do cliente deve ser uma string' })
  clientId?: string;

  @ApiPropertyOptional({
    description: 'Data inicial (formato: YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString({}, { message: 'A data inicial deve ser uma data válida' })
  from?: string;

  @ApiPropertyOptional({
    description: 'Data final (formato: YYYY-MM-DD)',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString({}, { message: 'A data final deve ser uma data válida' })
  to?: string;

  @ApiPropertyOptional({
    description: 'Número da página',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'A página deve ser um número inteiro' })
  @Min(1, { message: 'A página deve ser no mínimo 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O limit deve ser um número inteiro' })
  @Min(1, { message: 'O limit deve ser no mínimo 1' })
  @Max(1000, { message: 'O limit deve ser no máximo 1000' })
  limit?: number = 100;
}
