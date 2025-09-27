import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  findAllTasks() {
    return this.taskService.listAll();
  }

  @Get(':id')
  findOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.listOne(id);
  }

  @Patch(':id')
  alterateTask(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTaskDto) {
    return this.taskService.update(id, body);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.taskService.delete(id);
  }

  @Post('/create')
  createTask(@Body() body: CreateTaskDto) {
    return this.taskService.create(body);
  }
}
