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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { LoggerInterceptor } from 'src/common/interceptors/logger.interceptor';
import { CreateTaskInterceptor } from 'src/common/interceptors/body-create-task.interceptor';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';


@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get()
  @UseInterceptors(LoggerInterceptor)
  @UseInterceptors(AddHeaderInterceptor)
  listAllTasks(@Query() query: PaginationDto) {
    return this.taskService.listAllTasks(query);
  }

  @Get(':id')
  listOneTask(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.listOneTask(id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  updateTask(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTaskDto, @TokenPayloadParam() tokenPayload: PayloadTokenDto) {
    return this.taskService.updateTask(id, body, tokenPayload);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number,  @TokenPayloadParam() tokenPayload: PayloadTokenDto) {
    return this.taskService.deleteTask(id, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Post('/create')
  @UseInterceptors(CreateTaskInterceptor)
  createTask(@Body() body: CreateTaskDto, @TokenPayloadParam() tokenPayload: PayloadTokenDto) {
    return this.taskService.createTask(body, tokenPayload);
  }
}
