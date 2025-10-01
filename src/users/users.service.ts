import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService : HashingServiceProtocol
  ) {}

  private readonly logger = new Logger(UsersService.name);

  async listOneUser(id: number) {
    this.logger.warn(`[Tentativa de listar usuário com id: ${id}]`);

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
      this.logger.warn(`[Erro ao buscar usuário com id: ${id}]`, error);

      throw new HttpException(
        'Erro ao tentar Listar o usuario.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(id: number, tokenPayload: PayloadTokenDto) {
    this.logger.warn(`[Tentativa de deletar usuario com id: ${id}]`);

    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { id: id },
      });

      if (!foundUser) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }

      if (foundUser.id !== tokenPayload.sub){
        throw new HttpException('Não autorizado!.', HttpStatus.UNAUTHORIZED);
      }

      await this.prisma.user.delete({ where: { id } });
      this.logger.warn(`[Usuário com id: ${id}, foi deletado!.]`);

      return { status: 200, message: 'Usuário deletado com sucesso' };
    } catch (err) {
      this.logger.warn(`[Erro ao deletar usuário com id: ${id} ]`, err);

      throw new HttpException(
        'Erro ao tentar Deletar Usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createUser(body: CreateUserDto) {
    this.logger.warn(`[Tentativa De Criar Usuario]`);

    const hashPassword = await this.hashingService.hash(body.password)

    try {
      const userCreated = await this.prisma.user.create({
        data: {
          name: body.name,
          hashPassword: hashPassword, 
          email: body.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      this.logger.warn(`[Usuario com nome : ${body.name}, Criado!]`);
      return userCreated;
    } catch (err) {
      this.logger.warn('[Erro ao tentar cadastrar Usuario]', err);
      throw new HttpException(
        'Erro ao tentar cadastrar Usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUser(id: number, body: UpdateUserDto, tokenPayload:PayloadTokenDto) {
    console.log(tokenPayload)
    this.logger.warn(`[Tentativa de atualizar Usuario com id: ${id}]`);
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { id: id },
      });

      if (!foundUser) {
        this.logger.warn(`[Usuario com id:${id} não Econtrado!]`);
        throw new HttpException(
          'Usuario Não encontrado!',
          HttpStatus.NOT_FOUND,
        );
      }

      if (foundUser.id !== tokenPayload.sub){
        throw new HttpException('Não Autorizado!.',HttpStatus.NOT_FOUND,);
      }


      const userData = {
        name: body.name ? body.name: foundUser.name,
        hashPassword: body.password ? await this.hashingService.hash(body.password) : foundUser.hashPassword
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: id },
        data: {
          name: userData.name,
          hashPassword: userData.hashPassword, 
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      this.logger.warn(`[Usuario com id: ${id} foi atualizado!]`);

      return updatedUser;
    } catch (error) {
      this.logger.warn(
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
