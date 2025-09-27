import { Controller, Get, Post } from '@nestjs/common'
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/teste')
  test(): string {
    return 'testando rota';
  }
  @Post('/teste')
  teste(): string {
    return 'fez o post';
  }
}
