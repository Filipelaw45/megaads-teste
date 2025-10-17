import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CashflowQueryDto } from './dto/cashflow-query.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CashflowResponseDto } from './dto/cashflow-response.dto';
import {
  ErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from 'src/shared/error-response.dto';

@Controller('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('cashflow')
  @ApiOperation({
    summary: 'Relatório de fluxo de caixa',
    description:
      'Retorna o fluxo de caixa com receitas, despesas e saldo por período',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Relatório de fluxo de caixa retornado com sucesso',
    type: CashflowResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Parâmetros inválidos',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não autorizado',
    type: UnauthorizedErrorResponseDto,
  })
  getCashflow(
    @Query() queryDto: CashflowQueryDto,
  ): Promise<CashflowResponseDto> {
    return this.reportsService.getCashflow(queryDto);
  }
}
