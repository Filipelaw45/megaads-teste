import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=])[0-9a-zA-Z!@#$%^&*()_+\-=]{8,}$/,
    {
      message:
        'A senha deve ter no mínimo 8 caracteres, pelo menos 1 letra minúscula, 1 letra maiúscula, 1 número e 1 caractere especial',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  roles: 'ADMIN' | 'USER';
}
