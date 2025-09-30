import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post()
  signIn(@Body() body: LoginDto) {
    return this.authService.authenticate(body)
  }

}
