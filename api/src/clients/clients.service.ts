import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
import { ClientDto } from './dto/client.dto';
import { plainToInstance } from 'class-transformer';
import { formatCpfCnpj } from 'src/utils/CpfCnpj-utils';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<ClientDto> {
    const existingClient = await this.clientRepository.findOne({
      where: [
        { email: createClientDto.email },
        { cpfCnpj: createClientDto.cpfCnpj },
      ],
      withDeleted: true,
    });

    if (existingClient) {
      if (existingClient.email === createClientDto.email) {
        throw new ConflictException('Email já existe');
      }
      if (existingClient.cpfCnpj === createClientDto.cpfCnpj) {
        throw new ConflictException('CPF/CNPJ já existe');
      }
    }

    const formattedCpfCnpj = formatCpfCnpj(createClientDto.cpfCnpj);

    const client = this.clientRepository.create({
      ...createClientDto,
      cpfCnpj: formattedCpfCnpj,
    });

    const savedClient = await this.clientRepository.save(client);

    return plainToInstance(ClientDto, savedClient, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(queryDto: QueryClientDto): Promise<{
    data: ClientDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      firstName,
      lastName,
      email,
      cpfCnpj,
      page = 1,
      limit = 100,
    } = queryDto;

    const queryBuilder = this.clientRepository.createQueryBuilder('client');

    const filters = {
      firstName: { field: 'client.firstName', value: firstName },
      lastName: { field: 'client.lastName', value: lastName },
      email: { field: 'client.email', value: email },
      cpfCnpj: { field: 'client.cpfCnpj', value: cpfCnpj },
    };

    Object.entries(filters).forEach(([key, { field, value }]) => {
      if (value) {
        queryBuilder.andWhere(`${field} ILIKE :${key}`, {
          [key]: `%${value}%`,
        });
      }
    });

    const [clients, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('client.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data: plainToInstance(ClientDto, clients, {
        excludeExtraneousValues: true,
      }),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<ClientDto> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return plainToInstance(ClientDto, client, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<ClientDto> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    const whereConditions: Array<UpdateClientDto> = [];
    if (updateClientDto.email !== client.email) {
      whereConditions.push({ email: updateClientDto.email });
    }
    if (updateClientDto.cpfCnpj !== client.cpfCnpj) {
      whereConditions.push({ cpfCnpj: updateClientDto.cpfCnpj });
    }

    if (whereConditions.length > 0) {
      const existingClient = await this.clientRepository.findOne({
        where: whereConditions,
      });

      if (existingClient && existingClient.id !== id) {
        if (existingClient.email === updateClientDto.email) {
          throw new ConflictException('Email em uso');
        }
        if (existingClient.cpfCnpj === updateClientDto.cpfCnpj) {
          throw new ConflictException('CPF/CNPJ em uso');
        }
      }
    }

    Object.assign(client, updateClientDto);

    const updatedClient = await this.clientRepository.save(client);

    return plainToInstance(ClientDto, updatedClient, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    const client = await this.clientRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    await this.clientRepository.softDelete(id);
  }
}
