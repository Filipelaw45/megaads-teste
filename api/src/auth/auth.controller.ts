import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import {
  ConflictErrorResponseDto,
  ErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from 'src/shared/error-response.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiBody({
    type: LoginDto,
    examples: {
      exemplo1: {
        summary: 'Login com email',
        value: {
          emailUsername: 'usuario@example.com',
          password: 'senha123',
        },
      },
      exemplo2: {
        summary: 'Login com username',
        value: {
          emailUsername: 'usuario123',
          password: 'senha123',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciais inválidas',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    const token = await this.authService.signIn(
      loginDto.emailUsername,
      loginDto.password,
    );
    return token;
  }

  @Post('register')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      exemplo1: {
        summary: 'Registro de usuário',
        value: {
          email: 'novousuario@example.com',
          username: 'novousuario',
          password: 'senha123',
          roles: ['USER'],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário registrado com sucesso',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email ou nome de usuário já em uso',
    type: ConflictErrorResponseDto,
  })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegisterResponseDto> {
    await this.usersService.create(createUserDto);
    return { message: 'Usuário registrado com sucesso' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar token de acesso usando refresh token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token atualizado com sucesso',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Refresh token inválido ou expirado',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Refresh token não fornecido',
    type: ErrorResponseDto,
  })
  async refresh(
    @Body() Body: { refreshToken: string },
  ): Promise<LoginResponseDto> {
    const { refreshToken } = Body;
    return this.authService.refresh(refreshToken);
  }
}
