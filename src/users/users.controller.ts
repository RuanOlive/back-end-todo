import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  listOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.listOneUser(id);
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number, @TokenPayloadParam() tokenPayload: PayloadTokenDto) {
    return this.userService.deleteUser(id, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto,
  ) {
    return this.userService.updateUser(id, body, tokenPayload);
  }
}
