import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { User } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    const existingEmail = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existingEmail) {
      throw new ConflictException('O email já está em uso');
    }

    const existingUsername = await this.userRepository.findOne({
      where: { username: userData.username },
    });

    if (existingUsername) {
      throw new ConflictException('O nome de usuário já está em uso');
    }

    const savedUser = await this.userRepository.save(
      this.userRepository.create(userData),
    );

    const { id, email, username, roles, createdAt, updatedAt } = savedUser;
    return { id, email, username, roles, createdAt, updatedAt };
  }

  async findByEmailOrUsername(emailUsername: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: [{ email: emailUsername }, { username: emailUsername }],
    });

    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const { email, username, roles, createdAt, updatedAt } = user;
    return { id, email, username, roles, createdAt, updatedAt };
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    await this.userRepository.update({ id: userId }, { refreshToken });
  }

  async getRefreshToken(userId: string): Promise<string | undefined> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['refreshToken'],
    });

    return user?.refreshToken;
  }
}
