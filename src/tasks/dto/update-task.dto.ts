import { IsBoolean, IsOptional, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdateTaskDto {
  @IsString({ message: 'O nome deve ser um texto válido.' })
  @MinLength(5, { message: 'O nome deve ter no mínimo 5 caracteres.' })
  @IsOptional()
  @MaxLength(50, { message: 'O nome pode ter no máximo 50 caracteres.' })
  readonly name?: string;
  
  @IsString({ message: 'A descrição deve ser um texto válido.' })
  @IsOptional()
  @MinLength(5, { message: 'A descrição deve ter no mínimo 5 caracteres.' })
  @MaxLength(255, { message: 'A descrição pode ter no máximo 255 caracteres.' })
  readonly description?: string;

  @IsOptional()
  @IsBoolean({ message: 'O campo completed deve ser um valor booleano (true ou false).' })
  readonly completed?: boolean;
}
