import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import type Request from 'express';
import { REQUEST_TOKEN_PAYLOAD_NAME } from 'src/auth/constants/auth.constants';



@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  listOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.listOneUser(id);
  }

  @Post()
  createUser(@Body() body:CreateUserDto) {
    return this.userService.createUser(body)
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() body:UpdateUserDto, @Req() req: Request) {
    console.log(req[REQUEST_TOKEN_PAYLOAD_NAME])
    return this.userService.updateUser(id, body);
  }
  
}
