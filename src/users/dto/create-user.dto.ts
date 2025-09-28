import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length, MaxLength } from "class-validator";

export class CreateUserDto {
  @IsString({ message: "O nome deve ser um texto válido." })
  @IsNotEmpty({ message: "O nome é obrigatório." })
  @MaxLength(20, { message: "O nome não pode ter mais que 20 caracteres." })
  readonly name: string;

  @IsNotEmpty({ message: "O e-mail é obrigatório." })
  @IsEmail({}, { message: "Informe um e-mail válido." })
  @MaxLength(32, { message: "O e-mail não pode ter mais que 32 caracteres." })
  readonly email: string;

  @IsNotEmpty({ message: "A senha é obrigatória." })
  @IsString({ message: "A senha deve ser um texto válido." })
  @Length(8, 32, { message: "A senha deve ter entre 8 e 32 caracteres." })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1
  })
  readonly password: string;
}
