import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModules } from '../users/users.module';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports: [UsersModules, TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
