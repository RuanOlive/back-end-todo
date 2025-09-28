import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() body:UpdateUserDto) {
    return this.userService.updateUser(id, body);
  }
  
}
