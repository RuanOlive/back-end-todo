import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  findAllTasks() {
    return this.taskService.listAll();
  }

  @Get(':id')
  findOneTask(@Param('id') id: string) {
    return this.taskService.listOne(id);
  }

  @Patch(':id')
  alterateTask(@Param('id') id: string, @Body() body: any) {
    return this.taskService.update(id, body);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @Body() body: any) {
    return this.taskService.delete(id);
  }

  @Post('/create')
  createTask(@Body() body: any) {
    return this.taskService.create(body);
  }
}
