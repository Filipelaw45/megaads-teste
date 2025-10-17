import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AdminUserSeed {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    const adminUser = this.userRepository.create({
      email: 'admin@example.com',
      username: 'admin',
      roles: 'ADMIN',
      password: 'Admin@123',
    });

    await this.userRepository.save(adminUser);
  }
}
