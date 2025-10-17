import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsCpfCnpjValid } from '../../utils/CpfCnpj-utils';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João',
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  firstName: string;

  @ApiProperty({
    description: 'Sobrenome do cliente',
    example: 'Silva',
  })
  @IsString({ message: 'O sobrenome deve ser uma string' })
  @IsNotEmpty({ message: 'O sobrenome não pode estar vazio' })
  @MaxLength(100, { message: 'O sobrenome deve ter no máximo 100 caracteres' })
  lastName: string;

  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao.silva@example.com',
  })
  @IsEmail({}, { message: 'O email deve ser um email válido' })
  @IsNotEmpty({ message: 'O email não pode estar vazio' })
  email: string;

  @ApiProperty({
    description: 'CPF ou CNPJ do cliente',
    example: '123.456.789-09 ou 12.345.678/0001-95',
  })
  @IsNotEmpty({ message: 'O CPF/CNPJ não pode estar vazio' })
  @IsString({ message: 'O CPF/CNPJ deve ser uma string' })
  @IsCpfCnpjValid()
  cpfCnpj: string;
}
