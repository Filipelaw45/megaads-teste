import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString } from 'class-validator';

export class CashflowQueryDto {
  @ApiProperty({
    description: 'Data inicial do período',
    example: '2025-01-01',
    format: 'date',
  })
  @IsNotEmpty({ message: 'Data inicial é obrigatória' })
  @IsDateString(
    {},
    { message: 'Data inicial deve ser uma data válida (YYYY-MM-DD)' },
  )
  from: string;

  @ApiProperty({
    description: 'Data final do período',
    example: '2025-01-01',
    format: 'date',
  })
  @IsNotEmpty({ message: 'Data final é obrigatória' })
  @IsDateString(
    {},
    { message: 'Data final deve ser uma data válida (YYYY-MM-DD)' },
  )
  to: string;
}
