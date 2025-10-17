import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: 400,
    description: 'Código de status HTTP',
  })
  statusCode: number;

  @ApiProperty({
    example: [
      'Descrição do erro 1',
      'Descrição do erro 2',
      'Descrição do erro 3',
    ],
    description: 'Mensagem de erro',
  })
  message: [String];

  @ApiProperty({
    example: 'Bad Request',
    description: 'Descrição do erro',
    required: false,
  })
  error?: string;
}

export class ErrorNotFoundResponseDto {
  @ApiProperty({
    example: 404,
    description: 'Código de status HTTP',
  })
  statusCode: number;

  @ApiProperty({
    example: "Recurso não encontrado",
    description: 'Mensagem de erro',
  })
  message: string;

  @ApiProperty({
    example: 'Not Found',
    description: 'Descrição do erro',
    required: false,
  })
  error?: string;
}

export class ConflictErrorResponseDto {
  @ApiProperty({
    example: 409,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Mensagem de conflito',
  })
  message: string;

  @ApiProperty({
    example: 'Conflict',
  })
  error: string;
}

export class UnauthorizedErrorResponseDto {
  @ApiProperty({
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Unauthorized',
  })
  message: string;
}
