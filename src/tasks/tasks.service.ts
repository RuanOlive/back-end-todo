import {
  HttpException,
  HttpStatus,
  HttpVersionNotSupportedException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      name: 'lavar louça',
      description: 'comprar detergente antes!',
      completed: false,
    },
  ];

  listAll() {
    console.log('Listando Todas As Tarefas!');
    return this.tasks;
  }

  listOne(id: number) {
    console.log('listando uma tarefa');
    const task = this.tasks.find((task) => task.id === Number(id));

    if (task) {
      return task;
    }

    throw new HttpException('Essa tarefa não existe.', HttpStatus.NOT_FOUND);
    // Podem ser econtrados mais HttpStatus na documentação do nest
    //throw new NotFoundException('Esta tarefa não existe');
    //throw new HttpException('Essa tarefa não existe.', HttpStatus.BAD_REQUEST);
  }

  create(body: CreateTaskDto) {
    console.log('tarefa criada!');
    const newId = this.tasks.length + 1;

    const newTask = {
      id: newId,
      ...body,
      completed: false,
    };

    this.tasks.push(newTask);

    return newTask;
  }

  update(id: number, body: UpdateTaskDto) {
    console.log('alterando tarefa com id : ', id);

    const taskIndex = this.tasks.findIndex((task) => task.id === Number(id));

    if (taskIndex < 0) {
      throw new HttpException('Essa tarefa não existe.', HttpStatus.NOT_FOUND);
    }

    const taskItem = this.tasks[taskIndex];

    this.tasks[taskIndex] = {
      ...taskItem,
      ...body,
    };

    return this.tasks[taskIndex];
  }

  delete(id: number) {
    console.log('deletando tarefa com id: ', id);

    const taskIndex = this.tasks.findIndex((task) => task.id === Number(id));

    if (taskIndex < 0) {
      throw new HttpException('Essa tarefa não existe.', HttpStatus.NOT_FOUND);
    }

    this.tasks.splice(taskIndex, 1);

    throw new HttpException(
      'Tarefa Deletada com sucesso.',
      HttpStatus.ACCEPTED,
    );
  }
}
