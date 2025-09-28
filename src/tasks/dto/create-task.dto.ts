import { IsNotEmpty, IsString, MinLength, MaxLength, IsNumber, IsOptional} from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'O nome deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O nome da tarefa é obrigatório.' })
  @MinLength(5, { message: 'O nome deve ter no mínimo 5 caracteres.' })
  @MaxLength(50, { message: 'O nome pode ter no máximo 50 caracteres.' })
  readonly name: string;

  @IsString({ message: 'A descrição deve ser um texto válido.' })
  @IsOptional()
  @MinLength(5, { message: 'A descrição deve ter no mínimo 5 caracteres.' })
  @MaxLength(255, { message: 'A descrição pode ter no máximo 255 caracteres.' })
  readonly description?: string;

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;
}
