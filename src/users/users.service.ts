import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(UsersService.name);

  async listOneUser(id: number) {
    this.logger.log(`[Tentativa de listar usuário com id: ${id}]`);

    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { id: id },
        select: {
          id: true,
          name: true,
          email: true,
          tasks: true,
        },
      });

      if (!foundUser) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }

      return foundUser;
    } catch (error) {
      this.logger.log(`[Erro ao buscar usuário com id: ${id}]`, error);

      throw new HttpException(
        'Erro ao tentar Listar o usuario.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(id: number) {
    this.logger.log(`[Tentativa de deletar usuario com id: ${id}]`);

    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { id: id },
      });

      if (!foundUser) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }

      await this.prisma.user.delete({ where: { id } });
      this.logger.log(`[Usuário com id: ${id}, foi deletado!.]`);

      return { status: 200, message: 'Usuário deletado com sucesso' };
    } catch (err) {
      this.logger.log(`[Erro ao deletar usuário com id: ${id} ]`, err);

      throw new HttpException(
        'Erro ao tentar Deletar Usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createUser(body: CreateUserDto) {
    this.logger.log(`[Tentativa De Criar Usuario]`);
    try {
      const userCreated = await this.prisma.user.create({
        data: {
          name: body.name,
          hashPassword: body.password, //Armazenar criando hash da senha!
          email: body.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      this.logger.log(`[Usuario com nome : ${body.name}, Criado!]`);
      return userCreated;
    } catch (err) {
      this.logger.log('[Erro ao tentar cadastrar Usuario]', err);
      throw new HttpException(
        'Erro ao tentar cadastrar Usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUser(id: number, body: UpdateUserDto) {
    this.logger.log(`[Tentativa de atualizar Usuario com id: ${id}]`);
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { id: id },
      });

      if (!foundUser) {
        this.logger.log(`[Usuario com id:${id} não Econtrado!]`);
        throw new HttpException(
          'Usuario Não encontrado!',
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: id },
        data: {
          name: body.name ?? foundUser.name,
          hashPassword: body.password ?? foundUser.hashPassword, // Atualizar Armazenando Hash de senha depois
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      this.logger.log(`[Usuario com id: ${id} foi atualizado!]`);

      return updatedUser;
    } catch (error) {
      this.logger.log(
        `[Erro a tentar atualizar Usuario com id: ${id} ]`,
        error,
      );
      throw new HttpException(
        'Erro ao tentar atualizar usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
