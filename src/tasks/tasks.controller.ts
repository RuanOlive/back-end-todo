import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  findAllTasks(@Query() query: PaginationDto) {
    return this.taskService.listAll(query);
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
