import { Controller, Post, UseGuards, Get, Query, ValidationPipe, Param, ParseIntPipe, UsePipes, Body, Delete, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { GetUsersFilterDto } from './dto/get-users-filter.dto'
import { CreateUserDto } from './dto/user.create.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor (private usersService: UsersService) {}

  @Get()
  getUsers(
    @Query(ValidationPipe) filterDto: GetUsersFilterDto,
    @GetUser() user: User,
  ): Promise<User[]> {
    return this.usersService.getUsers(filterDto, user);
  }

  @Get('/:id')
  getUserById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<User> {
    return this.usersService.getUserById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createUserDto: CreateUserDto
  ): Promise<void> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete('/:id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
