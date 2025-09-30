import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { ApiExceptionFilter } from 'src/common/filters/exception-filter';

@Module({
    imports: [PrismaModule],
    controllers: [TasksController],
    providers: [
        TasksService,
        {
            provide: APP_FILTER,
            useClass: ApiExceptionFilter
        }
    ]
})

export class TasksModule {}
