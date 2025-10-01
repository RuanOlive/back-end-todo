import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async listAllTasks(query: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = query;

      return await this.prisma.task.findMany({
        take: limit,
        skip: offset,
      });
    } catch {
      throw new HttpException(
        'Erro ao tentar listar as tasks.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async listOneTask(id: number) {
    try {
      const foundTask = await this.prisma.task.findUnique({
        where: { id },
      });

      if (!foundTask) {
        throw new HttpException('Tarefa não encontrada!', HttpStatus.NOT_FOUND);
      }

      return foundTask;
    } catch {
      throw new HttpException('Erro ao listar a Task.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createTask(body: CreateTaskDto, tokenPayload: PayloadTokenDto) {
    try {
      return await this.prisma.task.create({
        data: {
          name: body.name,
          description: body.description,
          completed: false,
          userId: tokenPayload.sub,
        },
      });
    } catch {
      throw new HttpException('Erro ao criar a task.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTask(id: number, body: UpdateTaskDto, tokenPayload: PayloadTokenDto) {
    try {
      const foundTask = await this.prisma.task.findUnique({ where: { id } });

      if (!foundTask) {
        throw new HttpException('Tarefa não encontrada!', HttpStatus.NOT_FOUND);
      }

      if (foundTask.userId !== tokenPayload.sub) {
        throw new HttpException('Não autorizado!', HttpStatus.UNAUTHORIZED);
      }

      return await this.prisma.task.update({
        where: { id },
        data: {
          name: body.name ?? foundTask.name,
          description: body.description ?? foundTask.description,
          completed: body.completed ?? foundTask.completed,
        },
      });
    } catch {
      throw new HttpException(
        'Erro ao atualizar a task.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTask(id: number, tokenPayload: PayloadTokenDto) {
    try {
      const foundTask = await this.prisma.task.findUnique({ where: { id } });

      if (!foundTask) {
        throw new HttpException('Tarefa não encontrada.', HttpStatus.NOT_FOUND);
      }

      if (foundTask.userId !== tokenPayload.sub) {
        throw new HttpException('Não autorizado!', HttpStatus.UNAUTHORIZED);
      }

      return await this.prisma.task.delete({ 
        where: { id },
        select: { id: true, name: true, description: true, completed: true }
      });
    } catch {
      throw new HttpException('Erro ao deletar a task.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
