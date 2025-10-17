import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class ClientsSeed {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async seed() {
    const clients: Client[] = [];
    const numberOfClients = faker.number.int({ min: 5, max: 10 });

    for (let i = 0; i < numberOfClients; i++) {
      const client = new Client();
      client.firstName = faker.person.firstName();
      client.lastName = faker.person.lastName();
      client.email = faker.internet.email();
      client.cpfCnpj = faker.string.alphanumeric(14);
      clients.push(client);
    }

    await this.clientRepository.save(clients);
  }
}
