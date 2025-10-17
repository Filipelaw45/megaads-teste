import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { TransactionDto } from './dto/transaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from '../shared/error-response.dto';
import { Roles } from 'src/decorators/roles.decorator';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar uma nova transação',
    description: 'Cria uma nova transação (receita ou despesa) no sistema',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Transação criada com sucesso',
    type: TransactionDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente não encontrado',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Cliente com ID 67526397952 não encontrado',
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não autorizado',
    type: UnauthorizedErrorResponseDto,
  })
  create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar transações',
    description: 'Retorna uma lista de transações com filtros opcionais',
  })
  @ApiQuery({
    name: 'kind',
    required: false,
    enum: ['PAYABLE', 'RECEIVABLE'],
    description: 'Filtrar por tipo de transação',
    example: 'PAYABLE',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'PAID', 'CANCELLED'],
    description: 'Filtrar por status da transação',
    example: 'PENDING',
  })
  @ApiQuery({
    name: 'clientId',
    required: false,
    type: String,
    description: 'Filtrar por ID do cliente',
    example: '67526397952',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Quantidade de itens por página',
    example: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de transações retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/TransactionDto' },
        },
      },
    },
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
  findAll(@Query() queryDto: QueryTransactionDto) {
    return this.transactionsService.findAll(queryDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Buscar transação por ID',
    description: 'Retorna os detalhes de uma transação específica',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID da transação',
    example: '67526397952',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transação encontrada',
    type: TransactionDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transação não encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não autorizado',
    type: UnauthorizedErrorResponseDto,
  })
  findOne(@Param('id') id: string): Promise<TransactionDto> {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Atualizar transação',
    description: 'Atualiza os dados de uma transação existente',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID da transação',
    example: '67526397952',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transação atualizada com sucesso',
    type: TransactionDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transação não encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não autorizado',
    type: UnauthorizedErrorResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletar transação',
    description: 'Remove uma transação do sistema',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID da transação',
    example: '67526397952',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Transação deletada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transação não encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não autorizado',
    type: UnauthorizedErrorResponseDto,
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.transactionsService.remove(id);
  }

  @Post(':id/pay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Marcar transação como paga',
    description: 'Atualiza o status da transação para PAID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID da transação',
    example: '67526397952',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transação marcada como paga',
    type: TransactionDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transação não encontrada',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Transação já está paga ou foi cancelada',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Transação já está paga',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
        statusCode: {
          type: 'number',
          example: 400,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não autorizado',
    type: UnauthorizedErrorResponseDto,
  })
  pay(@Param('id') id: string): Promise<TransactionDto> {
    return this.transactionsService.pay(id);
  }
}
