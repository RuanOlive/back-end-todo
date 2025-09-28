import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async listAllTasks(query: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = query;

      const allTasks = await this.prisma.task.findMany({
        take: limit,
        skip: offset,
      });
      return allTasks;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Erro ao tentar listar as tasks.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async listOneTask(id: number) {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id: id,
        },
      });

      if (!task) {
        throw new HttpException('Tarefa não encontrada!', HttpStatus.NOT_FOUND);
      }

      return task;
    } catch (err) {
      console.log(err);
      throw new HttpException('Erro ao listar a Task.', HttpStatus.BAD_REQUEST);
    }
  }

  async createTask(body: CreateTaskDto) {
    try {
      const newTask = await this.prisma.task.create({
        data: {
          name: body.name,
          description: body.description,
          completed: false,
          userId: body.userId
        },
      });

      return newTask;
    } catch (err) {
      console.log(err);
      throw new HttpException('Erro', HttpStatus.BAD_REQUEST);
    }
  }

  async updateTask(id: number, body: UpdateTaskDto) {
    try {
      const foundTask = await this.prisma.task.findUnique({
        where: {
          id: id
        }
      })

      if (!foundTask) {
        throw new HttpException('Tarefa não encontrada!', HttpStatus.NOT_FOUND);
      }
      
      const updatedTask = await this.prisma.task.update({
        where: {
          id: id,
        },
        data: {
          name: body.name ?? foundTask.name,
          description: body.description ?? foundTask.description,
          completed: body.completed ?? foundTask.completed
        },
      });

      return updatedTask;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Erro ao Atualizar a task.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteTask(id: number) {
    try {
      await this.prisma.task.delete({
        where: {
          id: id,
        },
      });

      throw new HttpException(
        'Tarefa Deletada com sucesso.',
        HttpStatus.ACCEPTED,
      );
    } catch (err) {
      console.log('Erro ao Deletar Task!', err);
      throw new HttpException('Erro ao Deletar Task.', HttpStatus.BAD_REQUEST);
    }
  }
}
