import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CashflowPeriodDto {
  @ApiProperty({
    description: 'Data inicial do período',
    example: '2025-10-01',
    format: 'date',
  })
  @Expose()
  from: string;

  @ApiProperty({
    description: 'Data final do período',
    example: '2025-10-17',
    format: 'date',
  })
  @Expose()
  to: string;
}

export class CashflowTotalsDto {
  @ApiProperty({
    description: 'Total recebido no período',
    example: 1100,
    type: Number,
  })
  @Expose()
  received: number;

  @ApiProperty({
    description: 'Total pago no período',
    example: 560,
    type: Number,
  })
  @Expose()
  paid: number;

  @ApiProperty({
    description: 'Saldo (recebido - pago)',
    example: 540,
    type: Number,
  })
  @Expose()
  balance: number;
}

export class CashflowTimelineItemDto {
  @ApiProperty({
    description: 'Data da movimentação',
    example: '2025-10-16',
    format: 'date',
  })
  @Expose()
  date: string;

  @ApiProperty({
    description: 'Valor de entrada (recebido)',
    example: 1100,
    type: Number,
  })
  @Expose()
  in: number;

  @ApiProperty({
    description: 'Valor de saída (pago)',
    example: 560,
    type: Number,
  })
  @Expose()
  out: number;
}

export class CashflowResponseDto {
  @ApiProperty({
    description: 'Período do relatório',
    type: () => CashflowPeriodDto,
  })
  @Expose()
  period: CashflowPeriodDto;

  @ApiProperty({
    description: 'Totais do período',
    type: () => CashflowTotalsDto,
  })
  @Expose()
  totals: CashflowTotalsDto;

  @ApiProperty({
    description: 'Linha do tempo com movimentações diárias',
    type: () => [CashflowTimelineItemDto],
    isArray: true,
  })
  @Expose()
  timeline: CashflowTimelineItemDto[];
}
