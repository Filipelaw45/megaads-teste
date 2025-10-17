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
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
import { ClientDto } from './dto/client.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ErrorResponseDto,
  ConflictErrorResponseDto,
  UnauthorizedErrorResponseDto,
  ErrorNotFoundResponseDto,
} from '../shared/error-response.dto';

@ApiTags('Clients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo cliente' })
  @ApiResponse({
    status: 201,
    description: 'Cliente criado com sucesso',
    type: ClientDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Cliente já existe',
    type: ConflictErrorResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClientDto: CreateClientDto): Promise<ClientDto> {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes com paginação e filtros' })
  @ApiQuery({
    name: 'firstName',
    required: false,
    description: 'Filtrar por nome do cliente',
    type: String,
  })
  @ApiQuery({
    name: 'lastName',
    required: false,
    description: 'Filtrar por sobrenome do cliente',
    type: String,
  })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Filtrar por email do cliente',
    type: String,
  })
  @ApiQuery({
    name: 'cpfCnpj',
    required: false,
    description: 'Filtrar por CPF ou CNPJ do cliente',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de clientes retornada com sucesso',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ClientDto' },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Parâmetros de consulta inválidos',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não autorizado',
    type: UnauthorizedErrorResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryClientDto) {
    return this.clientsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um cliente por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalhes do cliente retornados com sucesso',
    type: ClientDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente não encontrado',
    type: ErrorNotFoundResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não autorizado',
    type: UnauthorizedErrorResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<ClientDto> {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar um cliente por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cliente atualizado com sucesso',
    type: ClientDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente não encontrado',
    type: ErrorNotFoundResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não autorizado',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Conflito ao atualizar cliente (email ou CPF/CNPJ já em uso)',
    type: ConflictErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<ClientDto> {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir um cliente por ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Cliente excluído com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cliente não encontrado',
    type: ErrorNotFoundResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não autorizado',
    type: UnauthorizedErrorResponseDto,
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.clientsService.remove(id);
  }
}
