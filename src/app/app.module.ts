import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
/* import { APP_GUARD } from '@nestjs/core';
import { AuthAdminGuard } from 'src/common/guards/admin.guard'; */
import { AuthModule } from 'src/auth/auth.module';
import jwtConfig from 'src/auth/config/jwt.config';
import * as Joi from 'joi';

@Module({
  imports: [
    UsersModule,
    TasksModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.production.env'
          : '.development.env',
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_TTL: Joi.string().default('3600s'),
        JWT_TOKEN_AUDIENCE: Joi.string().optional(),
        JWT_TOKEN_ISSUER: Joi.string().optional(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    /* {
      provide: APP_GUARD,
      useClass: AuthAdminGuard
    } */
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
